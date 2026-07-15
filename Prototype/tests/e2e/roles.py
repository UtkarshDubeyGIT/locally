from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE = "http://127.0.0.1:3000"
PASSWORD = "LocallyDemo!2026"
OUT = Path("test-results/browser")
OUT.mkdir(parents=True, exist_ok=True)

def login(page, email):
    page.goto(f"{BASE}/login")
    page.wait_for_load_state("networkidle")
    page.get_by_label("Email address").fill(email)
    page.get_by_label("Password").fill(PASSWORD)
    page.get_by_role("button", name="Sign in").click()
    page.wait_for_load_state("networkidle")

def logout(page):
    page.get_by_role("button", name="Sign out").click()
    page.wait_for_load_state("networkidle")
    expect(page).to_have_url(f"{BASE}/login")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1440, "height": 1000})
    page = context.new_page()
    console_errors = []
    page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

    page.goto(f"{BASE}/login")
    page.wait_for_load_state("networkidle")
    expect(page.get_by_role("heading", name="Welcome back.")).to_be_visible()
    page.keyboard.press("Tab")
    assert page.evaluate("document.activeElement !== document.body")
    page.screenshot(path=str(OUT / "login-desktop.png"), full_page=True)

    login(page, "owner@locally.demo")
    expect(page).to_have_url(f"{BASE}/agency")
    expect(page.get_by_role("heading", name="Good morning. Here’s what deserves attention.")).to_be_visible()
    page.screenshot(path=str(OUT / "owner-dashboard.png"), full_page=True)
    page.get_by_role("link", name="Reviews", exact=True).click()
    page.wait_for_load_state("networkidle")
    expect(page.get_by_text("Nikhil S. · 1★")).to_be_visible()
    logout(page)

    login(page, "specialist@locally.demo")
    expect(page).to_have_url(f"{BASE}/agency")
    page.get_by_role("link", name="Clients", exact=True).click()
    page.wait_for_load_state("networkidle")
    expect(page.get_by_role("heading", name="Every local story, in one place.")).to_be_visible()
    assert page.locator(".grid--3 > a").count() == 3
    logout(page)

    context.close()
    mobile = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=1)
    page = mobile.new_page()
    page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
    login(page, "client@madhursweets.demo")
    expect(page).to_have_url(f"{BASE}/client")
    expect(page.get_by_role("heading", name="Your branches are moving in the right direction.")).to_be_visible()
    assert page.get_by_role("link", name="Reviews", exact=True).count() == 0
    page.goto(f"{BASE}/agency/reviews")
    page.wait_for_load_state("networkidle")
    expect(page).to_have_url(f"{BASE}/client")
    assert page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth")
    page.screenshot(path=str(OUT / "client-mobile.png"), full_page=True)
    page.get_by_role("link", name="Onboarding", exact=True).click()
    page.wait_for_load_state("networkidle")
    expect(page.get_by_text("Step 2 of 4")).to_be_visible()
    page.screenshot(path=str(OUT / "onboarding-mobile.png"), full_page=True)

    page.goto(f"{BASE}/demo-sites/madhur-sweets/dwarka")
    page.wait_for_load_state("networkidle")
    expect(page.get_by_role("heading", name="Made slowly. Shared warmly.")).to_be_visible()
    page.screenshot(path=str(OUT / "demo-branch-mobile.png"), full_page=True)

    assert not console_errors, f"Browser console errors: {console_errors}"
    mobile.close()
    browser.close()
    print("E2E_PASS owner specialist client mobile public-branch keyboard console")
