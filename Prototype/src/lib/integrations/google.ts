import { z } from "zod";

const lighthouseSchema=z.object({lighthouseResult:z.object({categories:z.object({performance:z.object({score:z.number().nullable()}),accessibility:z.object({score:z.number().nullable()}),seo:z.object({score:z.number().nullable()}),"best-practices":z.object({score:z.number().nullable()})}),audits:z.record(z.string(),z.object({title:z.string(),score:z.number().nullable(),displayValue:z.string().optional()}).passthrough())})});
export async function runPageSpeed(url:string,strategy:"mobile"|"desktop"){
  const params=new URLSearchParams({url,strategy,category:"performance"});
  for(const category of ["accessibility","seo","best-practices"])params.append("category",category);
  if(process.env.GOOGLE_PAGESPEED_API_KEY)params.set("key",process.env.GOOGLE_PAGESPEED_API_KEY);
  const response=await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`,{cache:"no-store"});
  if(!response.ok)throw new Error(`PageSpeed failed (${response.status}). No demo score replaced the failed live result.`);
  const parsed=lighthouseSchema.parse(await response.json());const l=parsed.lighthouseResult;
  const score=(name:keyof typeof l.categories)=>Math.round((l.categories[name].score??0)*100);
  const failed=Object.entries(l.audits).filter(([,a])=>a.score!==null&&a.score<.9).slice(0,8).map(([id,a])=>({id,title:a.title,details:a.displayValue??"Needs improvement"}));
  return {performance:score("performance"),accessibility:score("accessibility"),seo:score("seo"),bestPractices:score("best-practices"),failed,raw:l};
}

const placesSchema=z.object({places:z.array(z.object({id:z.string(),displayName:z.object({text:z.string()}),formattedAddress:z.string().optional(),location:z.object({latitude:z.number(),longitude:z.number()}).optional(),rating:z.number().optional(),userRatingCount:z.number().optional(),primaryTypeDisplayName:z.object({text:z.string()}).optional(),googleMapsUri:z.string().optional()})).default([])});
export async function searchPlaces(query:string,center:{latitude:number;longitude:number}){
  if(!process.env.GOOGLE_PLACES_API_KEY)throw new Error("Places is not configured. Add GOOGLE_PLACES_API_KEY or use manual competitor entry; no fallback is labeled live.");
  const response=await fetch("https://places.googleapis.com/v1/places:searchText",{method:"POST",headers:{"content-type":"application/json","X-Goog-Api-Key":process.env.GOOGLE_PLACES_API_KEY,"X-Goog-FieldMask":"places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.primaryTypeDisplayName,places.googleMapsUri"},body:JSON.stringify({textQuery:query,pageSize:5,locationBias:{circle:{center,radius:3500}},regionCode:"IN",languageCode:"en"})});
  if(!response.ok)throw new Error(`Places search failed (${response.status}). Try again or add a manual competitor.`);
  return placesSchema.parse(await response.json()).places;
}
export function distanceKm(a:{latitude:number;longitude:number},b:{latitude:number;longitude:number}){const rad=(v:number)=>v*Math.PI/180;const dLat=rad(b.latitude-a.latitude),dLon=rad(b.longitude-a.longitude);const x=Math.sin(dLat/2)**2+Math.cos(rad(a.latitude))*Math.cos(rad(b.latitude))*Math.sin(dLon/2)**2;return Math.round(6371*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))*10)/10}
