"""Validates the precompiled offline React app with an in-memory page (no local server required)."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OFF = ROOT / 'offline'
PREVIEWS = ROOT / 'previews'
PREVIEWS.mkdir(exist_ok=True)

def inline_app():
    return ('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
      + '<style>' + (OFF/'styles.css').read_text() + '</style></head><body><div id="root"></div>'
      + '<script>' + (OFF/'vendor/react.production.min.js').read_text() + '</script>'
      + '<script>' + (OFF/'vendor/react-dom.production.min.js').read_text() + '</script>'
      + '<script>' + (OFF/'app.js').read_text() + '</script>'
      + '<script>ReactDOM.render(React.createElement(window.Arquivo404App),document.getElementById("root"))</script></body></html>')

HTML=inline_app()

def check_overflow(page, desc):
    dims=page.evaluate('({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})')
    print(desc, 'width', dims)
    assert dims['scroll']<=dims['client']+2, f'horizontal overflow at {desc}'

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    for width,height in [(1440,900),(768,1024),(390,844),(320,740)]:
        page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
        errors=[]
        page.on('pageerror',lambda e: errors.append(str(e)))
        page.set_content(HTML,wait_until='load')
        assert 'desapareceu.' in page.locator('h1').first.inner_text()
        check_overflow(page,f'{width}px intro')
        page.screenshot(path=str(PREVIEWS/f'01_intro_{width}.png'),full_page=True)
        page.locator('#team').fill('Dupla Alfa')
        page.get_by_text('INICIAR OPERAÇÃO').click()
        assert page.locator('.overview-hero').count()==1
        check_overflow(page,f'{width}px dashboard')
        page.screenshot(path=str(PREVIEWS/f'02_dashboard_{width}.png'),full_page=True)
        if width<760:
            page.locator('.mobile-bottom-nav button').filter(has_text='Missões').click()
        else:
            page.locator('.desktop-sidebar .nav-item').filter(has_text='Missões').click() if width>1020 else page.locator('.mobile-menu-toggle').click() or page.locator('.mobile-menu .nav-item').filter(has_text='Missões').click()
        assert page.get_by_text('Linha do tempo').count()>=1
        check_overflow(page,f'{width}px phase1')
        page.screenshot(path=str(PREVIEWS/f'03_mission_{width}.png'),full_page=True)
        if width==1440:
            # Bad answer should not unlock mission
            page.locator('.code-form input').fill('blabla')
            page.locator('.code-form button').click()
            assert page.get_by_text('Linha do tempo').count()>=1
            for i,code in enumerate(['ABRIR','COFRE','LIA','5814'],1):
                page.locator('.code-form input').fill(code)
                page.locator('.code-form button').click()
                assert page.locator('.archive-item').count()==i
                print(f'phase {i} unlocked')
            page.screenshot(path=str(PREVIEWS/'04_all_unlocked.png'),full_page=True)
            page.locator('.desktop-sidebar .nav-item').filter(has_text='Veredito').click()
            page.screenshot(path=str(PREVIEWS/'05_verdict.png'),full_page=True)
            vals={
                'who':('Lia Torres','A-27'),
                'where':('Cofre B','C-04'),
                'how':('Acesso com T-27 e sessão de Hugo aberta','A-27'),
                'why':('Impedir exibição sem autorização','M-14')
            }
            for field,(ans,proof) in vals.items():
                question=page.locator('.verdict-question').filter(has=page.locator('h3')).nth(['who','where','how','why'].index(field))
                question.locator('select').nth(0).select_option(ans)
                question.locator('select').nth(1).select_option(proof)
            page.locator('input[name="decision"]').nth(1).check()
            page.locator('.submit-verdict').click()
            page.locator('.dialog-actions .action').filter(has_text='ENCERRAR CASO').click()
            assert page.locator('.report-score strong').inner_text()=='650'
            assert not errors, errors
            page.screenshot(path=str(PREVIEWS/'06_result_650.png'),full_page=True)
            print('verdict score 650 verified')
        assert not errors, errors
        page.close()
    browser.close()
print('ALL PASS')
