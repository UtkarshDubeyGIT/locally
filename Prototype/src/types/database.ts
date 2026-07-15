export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      actions: {
        Row: {
          assigned_to: string | null
          client_id: string
          client_visible: boolean
          completed_at: string | null
          created_at: string
          created_by: string | null
          due_date: string | null
          id: string
          is_demo: boolean
          location_id: string | null
          priority: Database["public"]["Enums"]["action_priority"]
          source_id: string | null
          source_type: string
          status: Database["public"]["Enums"]["action_status"]
          title: string
        }
        Insert: {
          assigned_to?: string | null
          client_id: string
          client_visible?: boolean
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          is_demo?: boolean
          location_id?: string | null
          priority?: Database["public"]["Enums"]["action_priority"]
          source_id?: string | null
          source_type: string
          status?: Database["public"]["Enums"]["action_status"]
          title: string
        }
        Update: {
          assigned_to?: string | null
          client_id?: string
          client_visible?: boolean
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          is_demo?: boolean
          location_id?: string | null
          priority?: Database["public"]["Enums"]["action_priority"]
          source_id?: string | null
          source_type?: string
          status?: Database["public"]["Enums"]["action_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "actions_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      agencies: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      client_assignments: {
        Row: {
          client_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_assignments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_policies: {
        Row: {
          client_id: string
          compensation_policy: string | null
          escalation_categories: string[]
          google_access_status: string | null
          id: string
          initial_audit_findings: string | null
          initial_gbp_notes: string | null
          initial_recommended_actions: string | null
          priority_location_ids: string[]
          prohibited_claims: string[]
          response_tone: string
          target_keywords: string[]
          updated_at: string
        }
        Insert: {
          client_id: string
          compensation_policy?: string | null
          escalation_categories?: string[]
          google_access_status?: string | null
          id?: string
          initial_audit_findings?: string | null
          initial_gbp_notes?: string | null
          initial_recommended_actions?: string | null
          priority_location_ids?: string[]
          prohibited_claims?: string[]
          response_tone?: string
          target_keywords?: string[]
          updated_at?: string
        }
        Update: {
          client_id?: string
          compensation_policy?: string | null
          escalation_categories?: string[]
          google_access_status?: string | null
          id?: string
          initial_audit_findings?: string | null
          initial_gbp_notes?: string | null
          initial_recommended_actions?: string | null
          priority_location_ids?: string[]
          prohibited_claims?: string[]
          response_tone?: string
          target_keywords?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_policies_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          agency_id: string
          business_name: string
          created_at: string
          goals: Json
          id: string
          industry: string
          is_demo: boolean
          pain_points: Json
          preferred_communication: string
          primary_contact_email: string | null
          primary_contact_name: string | null
          reporting_cadence: string
          status: Database["public"]["Enums"]["client_status"]
          updated_at: string
          website: string | null
        }
        Insert: {
          agency_id: string
          business_name: string
          created_at?: string
          goals?: Json
          id?: string
          industry: string
          is_demo?: boolean
          pain_points?: Json
          preferred_communication?: string
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          reporting_cadence?: string
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          agency_id?: string
          business_name?: string
          created_at?: string
          goals?: Json
          id?: string
          industry?: string
          is_demo?: boolean
          pain_points?: Json
          preferred_communication?: string
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          reporting_cadence?: string
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      competitors: {
        Row: {
          address: string | null
          analyst_note: string | null
          captured_at: string
          category: string | null
          created_at: string
          created_by: string | null
          distance_km: number | null
          google_maps_uri: string | null
          google_place_id: string | null
          id: string
          latitude: number | null
          location_id: string
          longitude: number | null
          name: string
          rating: number | null
          review_count: number | null
          source_type: Database["public"]["Enums"]["source_type"]
        }
        Insert: {
          address?: string | null
          analyst_note?: string | null
          captured_at?: string
          category?: string | null
          created_at?: string
          created_by?: string | null
          distance_km?: number | null
          google_maps_uri?: string | null
          google_place_id?: string | null
          id?: string
          latitude?: number | null
          location_id: string
          longitude?: number | null
          name: string
          rating?: number | null
          review_count?: number | null
          source_type: Database["public"]["Enums"]["source_type"]
        }
        Update: {
          address?: string | null
          analyst_note?: string | null
          captured_at?: string
          category?: string | null
          created_at?: string
          created_by?: string | null
          distance_km?: number | null
          google_maps_uri?: string | null
          google_place_id?: string | null
          id?: string
          latitude?: number | null
          location_id?: string
          longitude?: number | null
          name?: string
          rating?: number | null
          review_count?: number | null
          source_type?: Database["public"]["Enums"]["source_type"]
        }
        Relationships: [
          {
            foreignKeyName: "competitors_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitors_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      email_deliveries: {
        Row: {
          attempted_at: string
          attempted_by: string | null
          client_id: string
          error_message: string | null
          id: string
          kind: string
          monthly_update_id: string | null
          provider_message_id: string | null
          recipient: string
          status: Database["public"]["Enums"]["delivery_status"]
        }
        Insert: {
          attempted_at?: string
          attempted_by?: string | null
          client_id: string
          error_message?: string | null
          id?: string
          kind: string
          monthly_update_id?: string | null
          provider_message_id?: string | null
          recipient: string
          status?: Database["public"]["Enums"]["delivery_status"]
        }
        Update: {
          attempted_at?: string
          attempted_by?: string | null
          client_id?: string
          error_message?: string | null
          id?: string
          kind?: string
          monthly_update_id?: string | null
          provider_message_id?: string | null
          recipient?: string
          status?: Database["public"]["Enums"]["delivery_status"]
        }
        Relationships: [
          {
            foreignKeyName: "email_deliveries_attempted_by_fkey"
            columns: ["attempted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_deliveries_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_deliveries_monthly_update_id_fkey"
            columns: ["monthly_update_id"]
            isOneToOne: false
            referencedRelation: "monthly_updates"
            referencedColumns: ["id"]
          },
        ]
      }
      gbp_health_checks: {
        Row: {
          check_name: string
          id: string
          location_id: string
          note: string | null
          source_type: Database["public"]["Enums"]["source_type"]
          status: Database["public"]["Enums"]["health_status"]
          updated_at: string
          value: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          check_name: string
          id?: string
          location_id: string
          note?: string | null
          source_type: Database["public"]["Enums"]["source_type"]
          status: Database["public"]["Enums"]["health_status"]
          updated_at?: string
          value?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          check_name?: string
          id?: string
          location_id?: string
          note?: string | null
          source_type?: Database["public"]["Enums"]["source_type"]
          status?: Database["public"]["Enums"]["health_status"]
          updated_at?: string
          value?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gbp_health_checks_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gbp_health_checks_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_usage: {
        Row: {
          count: number
          id: string
          integration: string
          usage_date: string
          user_id: string
        }
        Insert: {
          count?: number
          id?: string
          integration: string
          usage_date?: string
          user_id: string
        }
        Update: {
          count?: number
          id?: string
          integration?: string
          usage_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      location_performance_snapshots: {
        Row: {
          average_rating: number | null
          call_clicks: number
          created_at: string
          direction_requests: number
          id: string
          location_id: string
          maps_impressions: number
          period: string
          review_count: number
          search_impressions: number
          source_type: Database["public"]["Enums"]["source_type"]
          website_clicks: number
        }
        Insert: {
          average_rating?: number | null
          call_clicks?: number
          created_at?: string
          direction_requests?: number
          id?: string
          location_id: string
          maps_impressions?: number
          period: string
          review_count?: number
          search_impressions?: number
          source_type: Database["public"]["Enums"]["source_type"]
          website_clicks?: number
        }
        Update: {
          average_rating?: number | null
          call_clicks?: number
          created_at?: string
          direction_requests?: number
          id?: string
          location_id?: string
          maps_impressions?: number
          period?: string
          review_count?: number
          search_impressions?: number
          source_type?: Database["public"]["Enums"]["source_type"]
          website_clicks?: number
        }
        Relationships: [
          {
            foreignKeyName: "location_performance_snapshots_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string
          category: string
          city: string
          client_id: string
          created_at: string
          google_place_id: string | null
          id: string
          image_path: string | null
          is_demo: boolean
          latitude: number | null
          longitude: number | null
          name: string
          opening_hours: Json
          phone: string | null
          status: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          address: string
          category: string
          city: string
          client_id: string
          created_at?: string
          google_place_id?: string | null
          id?: string
          image_path?: string | null
          is_demo?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          opening_hours?: Json
          phone?: string | null
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          address?: string
          category?: string
          city?: string
          client_id?: string
          created_at?: string
          google_place_id?: string | null
          id?: string
          image_path?: string | null
          is_demo?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          opening_hours?: Json
          phone?: string | null
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_updates: {
        Row: {
          agency_summary: string | null
          approved_at: string | null
          approved_by: string | null
          client_id: string
          created_at: string
          created_by: string | null
          id: string
          is_demo: boolean
          metrics_json: Json
          month: string
          sent_at: string | null
          status: Database["public"]["Enums"]["report_status"]
          updated_at: string
        }
        Insert: {
          agency_summary?: string | null
          approved_at?: string | null
          approved_by?: string | null
          client_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_demo?: boolean
          metrics_json?: Json
          month: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
        }
        Update: {
          agency_summary?: string | null
          approved_at?: string | null
          approved_by?: string | null
          client_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_demo?: boolean
          metrics_json?: Json
          month?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_updates_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monthly_updates_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monthly_updates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_submissions: {
        Row: {
          answers_json: Json
          client_id: string
          current_step: number
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["client_status"]
          submitted_at: string | null
          submitted_by: string | null
          updated_at: string
        }
        Insert: {
          answers_json?: Json
          client_id: string
          current_step?: number
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string
        }
        Update: {
          answers_json?: Json
          client_id?: string
          current_step?: number
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_submissions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_submissions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_submissions_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active: boolean
          agency_id: string
          client_id: string | null
          created_at: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          active?: boolean
          agency_id: string
          client_id?: string | null
          created_at?: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          active?: boolean
          agency_id?: string
          client_id?: string | null
          created_at?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      report_feedback: {
        Row: {
          categories_json: Json
          client_user_id: string
          comment: string | null
          id: string
          monthly_update_id: string
          submitted_at: string
          usefulness: string
        }
        Insert: {
          categories_json?: Json
          client_user_id: string
          comment?: string | null
          id?: string
          monthly_update_id: string
          submitted_at?: string
          usefulness: string
        }
        Update: {
          categories_json?: Json
          client_user_id?: string
          comment?: string | null
          id?: string
          monthly_update_id?: string
          submitted_at?: string
          usefulness?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_feedback_client_user_id_fkey"
            columns: ["client_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_feedback_monthly_update_id_fkey"
            columns: ["monthly_update_id"]
            isOneToOne: false
            referencedRelation: "monthly_updates"
            referencedColumns: ["id"]
          },
        ]
      }
      review_internal_notes: {
        Row: {
          created_at: string
          created_by: string
          id: string
          note: string
          review_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          note: string
          review_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          note?: string
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_internal_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_internal_notes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_replies: {
        Row: {
          analysis_json: Json | null
          approved_at: string | null
          approved_by: string | null
          created_at: string
          created_by: string | null
          draft_text: string | null
          facts_to_verify: Json
          final_text: string | null
          generated_at: string | null
          id: string
          mock_published_at: string | null
          mock_published_by: string | null
          model_name: string | null
          prompt_version: string | null
          requires_manager_approval: boolean
          review_id: string
          safety_warnings: Json
          status: Database["public"]["Enums"]["review_status"]
          updated_at: string
          warnings_acknowledged_at: string | null
          warnings_acknowledged_by: string | null
        }
        Insert: {
          analysis_json?: Json | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          draft_text?: string | null
          facts_to_verify?: Json
          final_text?: string | null
          generated_at?: string | null
          id?: string
          mock_published_at?: string | null
          mock_published_by?: string | null
          model_name?: string | null
          prompt_version?: string | null
          requires_manager_approval?: boolean
          review_id: string
          safety_warnings?: Json
          status?: Database["public"]["Enums"]["review_status"]
          updated_at?: string
          warnings_acknowledged_at?: string | null
          warnings_acknowledged_by?: string | null
        }
        Update: {
          analysis_json?: Json | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          draft_text?: string | null
          facts_to_verify?: Json
          final_text?: string | null
          generated_at?: string | null
          id?: string
          mock_published_at?: string | null
          mock_published_by?: string | null
          model_name?: string | null
          prompt_version?: string | null
          requires_manager_approval?: boolean
          review_id?: string
          safety_warnings?: Json
          status?: Database["public"]["Enums"]["review_status"]
          updated_at?: string
          warnings_acknowledged_at?: string | null
          warnings_acknowledged_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_replies_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_replies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_replies_mock_published_by_fkey"
            columns: ["mock_published_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_replies_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: true
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_replies_warnings_acknowledged_by_fkey"
            columns: ["warnings_acknowledged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          category: string | null
          created_at: string
          external_review_id: string | null
          id: string
          location_id: string
          rating: number
          review_date: string
          review_text: string
          reviewer_name: string
          severity: Database["public"]["Enums"]["severity_level"]
          source_type: Database["public"]["Enums"]["source_type"]
          status: Database["public"]["Enums"]["review_status"]
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          external_review_id?: string | null
          id?: string
          location_id: string
          rating: number
          review_date: string
          review_text: string
          reviewer_name: string
          severity?: Database["public"]["Enums"]["severity_level"]
          source_type?: Database["public"]["Enums"]["source_type"]
          status?: Database["public"]["Enums"]["review_status"]
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          external_review_id?: string | null
          id?: string
          location_id?: string
          rating?: number
          review_date?: string
          review_text?: string
          reviewer_name?: string
          severity?: Database["public"]["Enums"]["severity_level"]
          source_type?: Database["public"]["Enums"]["source_type"]
          status?: Database["public"]["Enums"]["review_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      website_audit_items: {
        Row: {
          audit_id: string
          category: string
          check_name: string
          check_type: string
          details: string | null
          id: string
          recommendation: string | null
          status: Database["public"]["Enums"]["health_status"]
        }
        Insert: {
          audit_id: string
          category: string
          check_name: string
          check_type: string
          details?: string | null
          id?: string
          recommendation?: string | null
          status: Database["public"]["Enums"]["health_status"]
        }
        Update: {
          audit_id?: string
          category?: string
          check_name?: string
          check_type?: string
          details?: string | null
          id?: string
          recommendation?: string | null
          status?: Database["public"]["Enums"]["health_status"]
        }
        Relationships: [
          {
            foreignKeyName: "website_audit_items_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "website_audits"
            referencedColumns: ["id"]
          },
        ]
      }
      website_audits: {
        Row: {
          accessibility_score: number | null
          best_practices_score: number | null
          created_at: string
          id: string
          location_id: string
          page_url: string
          performance_score: number | null
          raw_result_json: Json | null
          run_by: string | null
          seo_score: number | null
          source_type: Database["public"]["Enums"]["source_type"]
          strategy: string
        }
        Insert: {
          accessibility_score?: number | null
          best_practices_score?: number | null
          created_at?: string
          id?: string
          location_id: string
          page_url: string
          performance_score?: number | null
          raw_result_json?: Json | null
          run_by?: string | null
          seo_score?: number | null
          source_type: Database["public"]["Enums"]["source_type"]
          strategy: string
        }
        Update: {
          accessibility_score?: number | null
          best_practices_score?: number | null
          created_at?: string
          id?: string
          location_id?: string
          page_url?: string
          performance_score?: number | null
          raw_result_json?: Json | null
          run_by?: string | null
          seo_score?: number | null
          source_type?: Database["public"]["Enums"]["source_type"]
          strategy?: string
        }
        Relationships: [
          {
            foreignKeyName: "website_audits_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "website_audits_run_by_fkey"
            columns: ["run_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      action_priority: "low" | "medium" | "high"
      action_status: "open" | "in_progress" | "done"
      client_status:
        | "draft"
        | "submitted_by_client"
        | "under_agency_review"
        | "active"
        | "archived"
      delivery_status: "pending" | "sent" | "failed"
      health_status: "pass" | "warning" | "fail" | "needs_verification"
      report_status: "draft" | "awaiting_owner_approval" | "approved" | "sent"
      review_status:
        | "needs_reply"
        | "draft"
        | "awaiting_approval"
        | "approved"
        | "mock_published"
        | "escalated"
      severity_level: "low" | "medium" | "high"
      source_type: "live_api" | "manual" | "mock_gbp" | "demo_data"
      user_role: "agency_owner" | "seo_employee" | "client_owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      action_priority: ["low", "medium", "high"],
      action_status: ["open", "in_progress", "done"],
      client_status: [
        "draft",
        "submitted_by_client",
        "under_agency_review",
        "active",
        "archived",
      ],
      delivery_status: ["pending", "sent", "failed"],
      health_status: ["pass", "warning", "fail", "needs_verification"],
      report_status: ["draft", "awaiting_owner_approval", "approved", "sent"],
      review_status: [
        "needs_reply",
        "draft",
        "awaiting_approval",
        "approved",
        "mock_published",
        "escalated",
      ],
      severity_level: ["low", "medium", "high"],
      source_type: ["live_api", "manual", "mock_gbp", "demo_data"],
      user_role: ["agency_owner", "seo_employee", "client_owner"],
    },
  },
} as const
