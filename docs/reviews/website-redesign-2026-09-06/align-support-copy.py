from pathlib import Path
import json
root=Path(__file__).resolve().parents[3]
near={
'en':'Bring the phones closer for initial setup, then verify readiness at your gate positions.',
'nb':'Sett telefonene nær hverandre ved tilkobling, og kontroller at de er klare på de planlagte portplasseringene.',
'de':'Bringe die Handys zum Verbinden näher zusammen und prüfe anschließend die Bereitschaft an den Messpunkten.',
'fr':'Rapprochez les téléphones pour la connexion, puis vérifiez leur disponibilité à chaque porte.',
'es':'Acerca los teléfonos para conectarlos y comprueba después que estén listos en las posiciones de las puertas.',
'pt':'Aproxime os celulares para conectar e depois confira se estão prontos nas posições de cronometragem.',
'it':'Avvicina i telefoni per collegarli, poi controlla che siano pronti nelle posizioni delle porte.',
'ja':'接続時はスマホ同士を近づけ、その後各ゲート位置で準備完了を確認してください。',
'zh-Hans':'初次连接时让手机靠近，再在各计时门位置确认就绪状态。',
'ko':'처음 연결할 때 휴대폰을 가까이 두고 각 게이트 위치에서 준비 상태를 확인하세요.',
'hi':'शुरुआती कनेक्शन के लिए फ़ोन पास लाएँ, फिर गेट की जगहों पर तैयार होने की स्थिति जाँचें।',
'ar':'قرّب الهواتف عند الاتصال الأول، ثم تحقّق من جاهزيتها في مواقع البوابات.',
'tr':'İlk bağlantıda telefonları yaklaştırın, ardından kapı konumlarında hazır olduklarını doğrulayın.',
}
dates={'en':'Last updated: September 6, 2026','nb':'Sist oppdatert: 6. september 2026','de':'Zuletzt aktualisiert: 6. September 2026','fr':'Dernière mise à jour : 6 septembre 2026','es':'Última actualización: 6 de septiembre de 2026','pt':'Última atualização: 6 de setembro de 2026','it':'Ultimo aggiornamento: 6 settembre 2026','ja':'最終更新：2026年9月6日','zh-Hans':'最后更新：2026年9月6日','ko':'최종 업데이트: 2026년 9월 6일','hi':'अंतिम अपडेट: 6 सितंबर 2026','ar':'آخر تحديث: 6 سبتمبر 2026','tr':'Son güncelleme: 6 Eylül 2026'}
for locale in near:
 p=root/f'messages/{locale}/support.json';d=json.loads(p.read_text());m=json.loads((root/f'messages/{locale}/marketing.json').read_text());q=d['faq']['items']
 q['howItWorks']['answer']=m['evidence']['body']
 q['equipment']['answer']=m['faq']['items'][0]['answer']
 q['accuracy']['answer']=m['faq']['items'][2]['answer']
 q['connecting']['answer']=m['modes']['gates']['steps'][1]+' '+m['faq']['items'][1]['answer']
 d['troubleshooting']['items']['noConnection']['solutions'][1]=near[locale]
 d['lastUpdated']=dates[locale]
 p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
