
#!/usr/bin/env node
const fs = require('fs');
const crypto = require('crypto');

const req = JSON.parse(fs.readFileSync('build-request.json', 'utf8'));
const {
      timePos = 'bottom',
        timeFormat = '12',
          showDate = true,
            showStats = false,
              appName = 'My Photo Clock',
                uuid = crypto.randomUUID()
                } = req;

                const hasTime = timePos !== 'none';

                ['app', 'resources', 'build'].forEach(d => {
                      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
                      });

                      fs.writeFileSync('package.json', JSON.stringify({
                          name: appName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
                            version: '1.0.0',
                              private: true,
                                appUUID: uuid,
                                  appType: 'clockface',
                                    buildTargets: ['rhea'],
                                      requestedPermissions: showStats ? ['access_activity', 'access_heart_rate'] : [],
                                        devDependencies: {
                                                '@fitbit/sdk': '~6.2.0-pre.1',
                                                    '@fitbit/sdk-cli': '~1.8.0-pre.10'
                                        }
                                        }, null, 2));

                                        const yTime = timePos === 'top' ? '14%' : timePos === 'center' ? '50%' : '86%';
                                        const yDate = timePos === 'top' ? '21%' : timePos === 'center' ? '57%' : '92%';

                                        const appJs = `import clock from "clock";
                                        ${showStats ? `import { today } from "user-activity";
                                            import { HeartRateSensor } from "heart-rate";` : ''}
                                            import { getElementById } from "document";
                                            clock.granularity = "minutes";
                                            ${hasTime ? `const timeEl = getElementById("timeLabel");` : ''}
                                            ${hasTime && showDate ? `const dateEl = getElementById("dateLabel");` : ''}
                                            ${showStats ? `const hrEl = getElementById("hrLabel");
                                                const stepsEl = getElementById("stepsLabel");
                                                if (HeartRateSensor) {
                                                  const hrm = new HeartRateSensor();
                                                    hrm.onreading = () => { if (hrEl) hrEl.text = "HR: " + (hrm.heartRate || "--"); };
                                                      hrm.start();
                                                      }` : ''}
                                                      const DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
                                                      const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
                                                      clock.ontick = (evt) => {
                                                          const d = evt.date, h = d.getHours(), m = d.getMinutes().toString().padStart(2, "0");
                                                            ${hasTime ? (timeFormat === '12' ? `timeEl.text = (h % 12 || 12) + ":" + m + (h < 12 ? " AM" : " PM");` : `timeEl.text = h + ":" + m;`) : ''}
                                                              ${hasTime && showDate ? `dateEl.text = DAYS[d.getDay()] + " " + d.getDate() + " " + MONTHS[d.getMonth()];` : ''}
                                                                ${showStats ? `try { if (stepsEl) stepsEl.text = (today.adjusted.steps || 0) + " steps"; } catch(e) {}` : ''}
                                                                };`;
                                                                
                                                                fs.writeFileSync('app/index.js', appJs);
                                                            
                                                            const overlayStyle = timePos === 'bottom'
                                                              ? 'x: 0; y: 72%; width: 100%; height: 28%;'
                                                                : timePos === 'top' ? 'x: 0; y: 0; width: 100%; height: 28%;'
                                                                  : 'display: none;';
                                                                  
                                                                  fs.writeFileSync('resources/index.view', `<svg class="background">
                                                                    <image href="photo.png" x="0" y="0" width="100%" height="100%" />
                                                                    ${showStats ? `  <text id="hrLabel" class="stat" x="30%" y="7%" text-anchor="middle" />
                                                                      <text id="stepsLabel" class="stat" x="70%" y="7%" text-anchor="middle" />` : ''}
                                                                      ${hasTime ? `  <rect id="overlay" class="overlay" />
                                                                        <text id="timeLabel" class="time" x="50%" y="${yTime}" text-anchor="middle" dominant-baseline="middle" />` : ''}
                                                                        ${hasTime && showDate ? `  <text id="dateLabel" class="date" x="50%" y="${yDate}" text-anchor="middle" dominant-baseline="middle" />` : ''}
                                                                        </svg>`);
                                                                        
                                                                        fs.writeFileSync('resources/styles.css', `.time { font-size: 54; font-weight: bold; fill: white; }
                                                                        .date { font-size: 20; fill: white; opacity: 0.85; letter-spacing: 2; }
                                                                        .stat { font-size: 16; fill: white; opacity: 0.85; }
                                                                        .overlay { ${overlayStyle} fill: rgba(0,0,0,0.45); }`);
                                                                        
                                                                        console.log('Source files generated for: ' + appName);}}`}``
                                        }
                      }))
                })
}