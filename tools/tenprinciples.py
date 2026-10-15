council = None  # marker
import base64, json, os

LOGO = base64.b64encode(open('/home/claude/build28/assets/img/logo-black.webp','rb').read()).decode()

PRINCIPLES = [
 ("01","Money is a story you must understand.",
  ["Money has no value of its own. The paper in your wallet, the digits in your bank account, the gold bar in a vault. None of these are wealth on their own. They are units of trust. Money works because we have collectively agreed that it works. The moment that agreement breaks, money becomes paper again.",
   "This sounds abstract until you watch a currency collapse, or notice how easily trillions of dollars in wealth disappeared in 2008. Money is fiction. Useful fiction. Powerful fiction. But fiction nonetheless.",
   "Understanding this changes how you treat money. You stop respecting it as an end in itself. You start using it as a tool to acquire real assets, real time, real options, and real freedom. People who treat money as a thing accumulate it badly. People who treat it as a story they can shape build wealth deliberately."],
  "Your business is a money creation engine. But the money it generates is only as durable as the system that creates it. Build the system first. The money follows the system. The system does not follow the money.",
  "What system in your business is creating money right now without your daily attention? What is creating money only because you are pushing it?"),
 ("02","Income is rented. Assets are owned.",
  ["Income depends on you showing up. Stop showing up and the income stops. That is not wealth. That is rent paid by the world in exchange for your continued effort.",
   "Assets are different. An asset works whether you sleep, travel, recover from illness, or step back to think. A property that generates rent. A business that runs on systems rather than on the founder. Equity in companies you do not run. Intellectual property that earns royalties. These are wealth because they keep working when you stop.",
   "Most founders are doing the hardest thing, which is running a business, but converting almost none of it into actual assets. The business itself can be the greatest asset they ever build, but only if they build it to function without them at the centre. Otherwise it is a job. A demanding, expensive, exhausting job with no exit."],
  "Audit your wealth honestly. How much of what you have built is an asset that works without you, and how much is income that depends on you? The ratio determines whether you are wealthy or just well paid.",
  "If you stopped working tomorrow, how long would your current lifestyle survive on what you actually own, without selling anything?"),
 ("03","Specific knowledge compounds faster than capital.",
  ["Specific knowledge is the kind that cannot be trained for. It is built through obsessive curiosity, lived experience, and the patient accumulation of pattern recognition that no one else has. It often looks like a hobby until it starts paying off.",
   "You cannot pay someone to acquire specific knowledge for you. You cannot delegate it. You cannot copy it from a course. It is uniquely yours. Paired with leverage, in the form of capital, code, content, or distribution, it becomes the most valuable thing you can own. More valuable than capital itself, because specific knowledge generates capital, but capital does not generate specific knowledge.",
   "Generic knowledge is what everyone in your industry knows. It puts you in competition with everyone else. Specific knowledge is what only you have noticed, often because you cared about something most people did not care about. That is your moat."],
  "What do you know about your industry, your customers, or your operations that almost nobody else knows? That knowledge is your most underpriced asset. Build leverage on top of it and you become uncopyable.",
  "What do you find yourself naturally noticing that your peers seem to miss? That noticing is the seed of specific knowledge."),
 ("04","Pay yourself first. Automatically.",
  ["Wealth is not what you earn. It is what you do not spend.",
   "The arithmetic is simple. The discipline is not. Spending expands to match income, a phenomenon so reliable it has its own name. Lifestyle inflation. You earn more. You spend more. The math works out to nearly zero net wealth created across decades of earning.",
   "The only protection against lifestyle inflation is a system. Money you mean to save must move before it touches your operating account. A fixed percentage to investments, transferred automatically. A fixed percentage of business profit, allocated mechanically. Not when you remember. Not when you feel disciplined. Always.",
   "Willpower is the most overestimated wealth building tool. Automation is the most underestimated."],
  "Your business has cashflow. Where does it go? Run the exercise honestly. Most founders find that ninety percent of profit is being recycled into the business or absorbed by lifestyle, and almost none is being converted into personal investable capital. Fix the leak with a fixed percentage transferred monthly, automatically, before any other allocation.",
  "If your bank automatically moved twenty percent of every business profit transfer into a personal investment account before you saw it, would you actually miss it? Or would your business find a way?"),
 ("05","Time in the market beats timing the market.",
  ["The greatest investors share one trait, and it is not intelligence. It is patience.",
   "Markets are noisy in the short term and orderly over decades. Compounding is mathematical magic, but it only works when you do not interrupt it. Each time you sell because you got scared, or buy because you got excited, or move sideways because you got bored, you cost yourself decades of compounding you will never get back.",
   "Wealth is not built by being clever in any individual year. It is built by being patient across many years. The clever ones who try to dance in and out of markets, even very intelligent ones, almost always underperform the simple ones who stayed put."],
  "Apply this to your business too. You do not need a new strategy every quarter. You need one good system executed patiently across years. Founders who pivot too often build nothing. Founders who choose well and persist build empires.",
  "What is one decision you made in the past three years that, in hindsight, you should have stayed with longer before changing course?"),
 ("06","Avoid catastrophic losses. All others are survivable.",
  ["The mathematics of recovery is brutal. A ten percent loss requires an eleven percent gain to recover. A fifty percent loss requires a hundred percent. A ninety percent loss requires nine hundred percent. Each step down costs you a non linear amount more on the way back up.",
   "This is why preserving capital matters more than growing it aggressively. You cannot compound from zero. You cannot compound from negative. A single catastrophic loss can erase a decade of patient gains and put you back at the starting line older, more cautious, and less confident.",
   "The pattern is consistent. People lose ruinous amounts not because they were unlucky, but because they took concentrated risks that did not work out and they had no margin of safety. Diversification, position sizing, and the discipline not to bet the house. These are not exciting. They are how wealth survives."],
  "What single point of failure could destroy your business overnight? One client representing sixty percent of revenue. One supplier who could vanish. One staff member who carries the only knowledge of a critical process. Find them. Reduce the concentration. Boring wins.",
  "What is the one event you could not survive financially? What would it take to reduce that exposure by half in the next ninety days?"),
 ("07","Debt is a tool. Learn its names.",
  ["Most of what people believe about debt is moral, not financial. Debt is bad, debt is sin, debt is to be avoided. None of this is useful when you are building wealth.",
   "There are two kinds of debt. Productive debt finances an asset that generates more income than the debt costs you. A mortgage on a property that produces rent. A business loan that funds a marketing system with measurable returns. Leverage that amplifies returns on assets that appreciate. This is debt working for you.",
   "Unproductive debt finances consumption. The credit card balance on lifestyle expenses. The car loan on a depreciating vehicle. The personal loan to fund things that do not earn anything back. This is debt working on you.",
   "The moral panic around debt has been weaponised against debtors for centuries. The truth is more useful. Learn which kind of debt you are using. The wrong kind compounds against you the same way the right kind compounds for you, only faster."],
  "Run your debts through one test. For each obligation, ask whether it is financing an asset that produces more than the debt costs. If yes, it is productive. If no, it is consumption, and it is taxing your wealth building.",
  "Which of your current debts produce nothing? What would it take to eliminate them in the next twelve months?"),
 ("08","Inversion outperforms optimisation.",
  ["Tell me where I am going to die, so I will never go there. This is one of the most useful ideas in wealth thinking. It is easier and more effective to identify what guarantees failure than to chase formulas for success.",
   "So instead of asking how do I get rich, ask what guarantees I stay poor. The answer is usually a list of small, normalised behaviours.",
   "Lifestyle inflation that quietly eats every raise. Cash leaks that nobody bothers to track. Avoidable taxes that compound across decades. Friends who normalise broke behaviour as personality. Debt taken for status. Investing only in things you do not understand. Procrastinating on the conversations you keep avoiding.",
   "You do not need to add anything new to your financial life to make significant progress. You need to subtract the things that quietly guarantee you will never be wealthy. Subtraction is cheaper, faster, and more reliable than addition."],
  "List the five financial habits in your life and business that you know are wrong but have not yet stopped. Stopping any three of them will change your trajectory more than any new strategy you adopt.",
  "What is the one financial behaviour you have been quietly defending that you already know is hurting you?"),
 ("09","Master the conversations you have been avoiding.",
  ["Most wealth dies in silence.",
   "The conversation you have not had with your spouse about how much you actually owe. The conversation you have not had with your children about what is coming and what is not. The conversation you have not had with your parents about how their estate is structured. The conversation you have not had with your business partner about what happens if one of you wants out.",
   "Family wealth, sometimes generations of it, disappears in a single inheritance cycle because nobody talked. Not because people were greedy. Because they were unprepared.",
   "The same applies inside a business. The pay conversation with your team. The equity conversation with your co founder. The honest conversation with yourself about whether you are actually making money or just generating revenue. Founders who have these conversations early build wealth. Founders who avoid them lose it in slow motion."],
  "List three financial conversations you have been postponing, whether with a partner, a family member, a co founder, or yourself. Pick one. Schedule it for this week. Do not let it slide again.",
  "Which conversation, if you had it tomorrow, would change the most about your financial life this year?"),
 ("10","Wealth is leverage on time, not money.",
  ["The goal of wealth is never the money itself. It is the time the money buys back. The right to choose how you spend your hours. The right to say no without calculation. The right to think long term because you are not financially desperate.",
   "Money is the unit. Time is the actual asset being purchased.",
   "This sounds philosophical until you measure it. How many of your hours each week are still being sold for income? How many are yours to direct as you please? The ratio is what defines wealthy, not the number in your bank account. There are well paid people working seventy hours a week who are not wealthy. There are people with modest portfolios who fully own their time. The second group is richer.",
   "Until your money is buying your time back, you are not yet wealthy. You are well paid. The day you can stop working without consequence is the day you find out whether you ever built anything."],
  "The business you are building should progressively buy your time back, not consume more of it. If year on year your business is requiring more of your hours rather than fewer, you are not building wealth. You are building a heavier job.",
  "Five years from now, do you want to be working harder than you are today, the same amount, or significantly less? What needs to be built starting now to make that real?"),
]

CSS = """
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Liberation Sans',Arial,Helvetica,sans-serif;color:#1A1A1A;
  -webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:210mm;height:296.5mm;position:relative;padding:26mm 20mm 24mm;
  page-break-after:always;overflow:hidden;background:#fff}
.hd{position:absolute;top:8mm;left:20mm;right:20mm;display:flex;align-items:flex-end;
  justify-content:space-between;border-bottom:2px solid #1A1A1A;padding-bottom:2.6mm}
.hd img{height:11mm;width:auto}
.hd span{font-size:8pt;color:#666}
.ft{position:absolute;bottom:8mm;left:20mm;right:20mm;display:flex;
  justify-content:space-between;border-top:.4pt solid #ccc;padding-top:2.4mm;
  font-size:7.5pt;color:#666}
.ft .num{color:#9A6B00}
.kick{font-size:9pt;letter-spacing:.08em;color:#9A6B00;font-weight:bold;
  text-transform:uppercase;margin-bottom:2.6mm}
h1{font-size:20.5pt;line-height:1.22;margin-bottom:4mm}
.bar{height:2.6pt;background:#9A6B00;margin-bottom:7mm;width:100%}
p.b{font-size:10.6pt;line-height:1.62;text-align:justify;margin-bottom:4.2mm}
.lbl{font-size:8.6pt;letter-spacing:.07em;color:#9A6B00;font-weight:bold;
  text-transform:uppercase;margin:5.5mm 0 2mm}
.pull{background:#F5F1E7;border-left:3.2pt solid #C9A227;padding:7mm 9mm;
  margin-top:7mm}
.pull .lbl{margin-top:0}
.pull p{font-size:11pt;line-height:1.6;font-style:italic;font-weight:bold}
.pull.center p{text-align:center}
/* cover */
.cover{text-align:center;padding-top:44mm}
.cover img{height:44mm;margin-bottom:22mm}
.cover .kick{margin-bottom:8mm}
.cover h1{font-size:30pt;line-height:1.15;margin-bottom:9mm}
.cover .sub{font-size:12.5pt;line-height:1.55;color:#333;max-width:130mm;
  margin:0 auto 4mm}
.cover .by{margin-top:34mm;font-size:9.5pt;font-style:italic;color:#555}
.cover .name{font-size:13pt;font-weight:bold;margin-top:2mm}
.cover .role{font-size:9.5pt;font-style:italic;color:#555;margin-top:1mm}
/* glance */
.glr{display:flex;gap:6mm;border-bottom:.4pt solid #ddd;padding:4.1mm 0;
  align-items:baseline}
.glr .n{color:#9A6B00;font-weight:bold;font-size:11.5pt;width:9mm;flex:none}
.glr .t{font-weight:bold;font-size:10.8pt}
/* closing */
.blk{background:#161616;color:#fff;text-align:center;padding:13mm 10mm;margin-top:12mm}
.blk .t{font-size:14pt;font-weight:bold;margin-bottom:7mm}
.blk .d{font-size:10pt;color:#ddd;margin-bottom:4mm}
.blk .u{font-size:10pt;color:#fff}
"""

def hd(title="10 Principles to Become Wealthy"):
    return f'<div class="hd"><img src="data:image/webp;base64,{LOGO}"><span>{title}</span></div>'

def ft(n):
    return ('<div class="ft"><span>© Suresh Balachandar · Your Coach with a Difference</span>'
            f'<span class="num">· {n} ·</span><span>www.sureshbalachandar.in</span></div>')

pages = []

# cover
pages.append(f'''<div class="pg cover">
 <img src="data:image/webp;base64,{LOGO}">
 <div class="kick">Money, discussed properly</div>
 <h1>10 Principles<br>to Become Wealthy</h1>
 <p class="sub">10 principles that separate people who build wealth from people who only build income.</p>
 <p class="sub">Drawn from 9 years of coaching, around 95 businesses, and a lifetime of reading on the subject.</p>
 <p class="by">by</p>
 <p class="name">Suresh Balachandar</p>
 <p class="role">Business Coach · Applied Psychologist · Entrepreneur</p>
 <div class="ft"><span>© Suresh Balachandar · Your Coach with a Difference</span><span></span><span>www.sureshbalachandar.in</span></div>
</div>''')

# foreword
pages.append(f'''<div class="pg">{hd()}
 <div class="kick">Foreword</div>
 <h1>Wealth has principles. Most of us never learned them.</h1>
 <div class="bar"></div>
 <p class="b">A business person must understand 2 things. Money and people. This document is about the first one.</p>
 <p class="b">Most of us were never taught money, because money is never discussed properly. At home it was a worry, kept away from the children. In school it was absent. Between friends it is either a boast or a secret. So we reach the age where real money moves through our hands still carrying habits we inherited, rather than principles we chose.</p>
 <p class="b">In 9 years of coaching around 95 businesses across Tamil Nadu and India, I have watched the same pattern repeat. People earning well but not getting wealthy. Businesses generating revenue without generating freedom. Owners who confuse working hard for money with building actual wealth.</p>
 <p class="b">The gap is not a knowledge problem. It is a principles problem. You are not missing information about money. You are missing a small set of clear principles you trust enough to act on consistently. So you oscillate. You earn, you spend, you occasionally save, you occasionally invest, and you mostly hope it will eventually pay off in some larger way that never quite arrives.</p>
 <p class="b">These are the 10 principles I keep returning to with the people I coach. They have been tested across nearly a hundred businesses. Each principle ends with a question to sit with, because the principles only matter when they meet your actual life and your actual numbers.</p>
 <div class="pull center"><p>You do not need more information.<br>You need a few principles you trust enough<br>to act on consistently.</p></div>
 <p class="b" style="margin-top:6mm">Read them slowly. Apply 2 or 3 at a time. The wealth is built in the practice, not in the reading.</p>
 {ft(2)}
</div>''')

# at a glance
rows = ''.join(f'<div class="glr"><span class="n">{n}</span><span class="t">{t}</span></div>'
               for n,t,_,_,_ in PRINCIPLES)
pages.append(f'''<div class="pg">{hd()}
 <div class="kick">The ten principles</div>
 <h1>At a glance.</h1>
 <div class="bar"></div>
 {rows}
 {ft(3)}
</div>''')

# principles
for i,(n,t,ins,fdr,sit) in enumerate(PRINCIPLES):
    body = ''.join(f'<p class="b">{p}</p>' for p in ins)
    pages.append(f'''<div class="pg">{hd()}
 <div class="kick">Principle {n}</div>
 <h1>{t}</h1>
 <div class="bar"></div>
 <div class="lbl">The insight</div>
 {body}
 <div class="lbl">For the founder</div>
 <p class="b">{fdr}</p>
 <div class="pull"><div class="lbl">Sit with this</div><p>{sit}</p></div>
 {ft(4+i)}
</div>''')

# closing
pages.append(f'''<div class="pg">{hd()}
 <div class="kick">From here</div>
 <h1>Knowing is not the work. Acting is.</h1>
 <div class="bar"></div>
 <p class="b">10 principles are easy to read in one sitting and impossible to act on all at once. So do not try. Pick 2. Apply them for 90 days. Watch what changes. Then pick 2 more.</p>
 <p class="b">Most wealth is built this way. Slowly. Deliberately. With patience that looks boring from the outside and feels right from the inside. The work is not in the knowing. It is in the applying. And the applying happens one principle at a time, one quarter at a time, one decision at a time.</p>
 <p class="b">If any of these landed for you, the next natural step is to come and sit at a board in Chennai and play the Cashflow Game. Money gets discussed properly there, out loud, with consequences on the table and other people watching. The principles stop being ideas.</p>
 <div class="blk">
  <div class="t">Register for the next Cashflow Game session</div>
  <div class="d">In Chennai · 5 hours · English and Tamil · ₹2,000 a seat</div>
  <div class="u">www.sureshbalachandar.in</div>
 </div>
 {ft(14)}
</div>''')

html = f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{"".join(pages)}</body></html>'
open('/home/claude/build28/tools/tenprinciples.html','w').write(html)
print('pages:', len(pages))
