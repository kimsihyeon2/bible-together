import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)

        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass

        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass

        # Interact with the page elements to simulate user flow
        # -> Click on the first active cell to navigate to its Bible Reading View.
        frame = context.pages[-1]
        # Click on the first active cell (1셀 청년부) to open Bible Reading View. 
        elem = frame.locator('xpath=html/body/div[2]/main/div/section/div/div/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        # -> Toggle between the two Bible translation buttons (개역개정 and 쉬운성경) multiple times rapidly to test content update and UI behavior.
        frame = context.pages[-1]
        # Click on 쉬운성경 button to switch Bible translation. 
        elem = frame.locator('xpath=html/body/div[2]/div/div/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000) 
        # -> Toggle between the two Bible translation buttons (개역개정 and 쉬운성경) multiple times rapidly and observe content update and UI behavior.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[2]/div/div/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[2]/div/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[2]/div/div/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[2]/div/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[2]/div/div/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[2]/div/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=개역개정').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=쉬운성경').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Complete').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=DAY 12').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=여호수아 정복 전쟁 시작').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=여호수아 1:1~9').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=여호와의 종 모세가 죽은 후에 여호와께서 모세의 수종자 눈의 아들 여호수아에게 말씀하여 이르시되').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=내 종 모세가 죽었으니 이제 너는 이 모든 백성과 더불어 일어나 이 요단을 건너 내가 그들 곧 이스라엘 자손에게 주는 그 땅으로 가라').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=내가 모세에게 말한 바와 같이 너희 발바닥으로 밟는 곳은 모두 내가 너희에게 주었노니').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=곧 광야와 이 레바논에서부터 큰 강 곧 유브라데 강까지 헷 족속의 온 땅과 또 해 지는 쪽 대해까지 너희의 영토가 되리라').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=네 평생에 너를 능히 대적할 자가 없으리니 내가 모세와 함께 있었던 것 같이 너와 함께 있을 것임이니라 내가 너를 떠나지 아니하며 버리지 아니하리니').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=강하고 담대하라 너는 내가 그들의 조상에게 맹세하여 그들에게 주리라 한 땅을 이 백성에게 차지하게 하리라').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=오직 강하고 지극히 담대하여 나의 종 모세가 네게 명령한 그 율법을 다 지켜 행하고 우로나 좌로나 치우치지 말라 그리하면 어디로 가든지 형통하리니').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=이 율법책을 네 입에서 떠나지 말게 하며 주야로 그것을 묵상하여 그 안에 기록된 대로 다 지켜 행하라 그리하면 네 길이 평탄하게 될 것이며 네가 형통하리라').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=내가 네게 명령한 것이 아니냐 강하고 담대하라 두려워하지 말며 놀라지 말라 네가 어디로 가든지 네 하나님 여호와가 너와 함께 하느니라 하시니라').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Pastor Kim').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    