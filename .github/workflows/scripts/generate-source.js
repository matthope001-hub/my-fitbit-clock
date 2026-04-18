'use strict';
const fs = require('fs');
const crypto = require('crypto');

const raw = fs.readFileSync('build-request.json', 'utf8');
const req = JSON.parse(raw);
const timePos = req.timePos || 'bottom';
const timeFormat = req.timeFormat || '12';
const showDate = req.showDate !== false;
const showStats = req.showStats === true;
const appName = req.appName || 'My Photo Clock';
const uuid = req.uuid || crypto.randomUUID();
const hasTime = timePos !== 'none';

if (!fs.existsSync('app')) fs.mkdirSync('app', { recursive: true });
if (!fs.existsSync('resources')) fs.mkdirSync('resources', { recursive: true });
if (!fs.existsSync('build')) fs.mkdirSync('build', { recursive: true });

// package.json
const pkg = {
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
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

// app/index.js - built with string concatenation
var appLines = [];
appLines.push('import clock from "clock";');
if (showStats) {
  appLines.push('import { today } from "user-activity";');
  appLines.push('import { HeartRateSensor } from "heart-rate";');
}
appLines.push('import { getElementById } from "document";');
appLines.push('clock.granularity = "minutes";');
if (hasTime) appLines.push('const timeEl = getElementById("timeLabel");');
if (hasTime && showDate) appLines.push('const dateEl = getElementById("dateLabel");');
if (showStats) {
  appLines.push('const hrEl = getElementById("hrLabel");');
  appLines.push('const stepsEl = getElementById("stepsLabel");');
  appLines.push('if (HeartRateSensor) {');
  appLines.push('  const hrm = new HeartRateSensor();');
  appLines.push('  hrm.onreading = function() { if (hrEl) hrEl.text = "HR: " + (hrm.heartRate || "--"); };');
  appLines.push('  hrm.start();');
  appLines.push('}');
}
appLines.push('var DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];');
appLines.push('var MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];');
appLines.push('clock.ontick = function(evt) {');
appLines.push('  var d = evt.date;');
appLines.push('  var h = d.getHours();');
appLines.push('  var m = d.getMinutes().toString();');
appLines.push('  if (m.length < 2) m = "0" + m;');
if (hasTime) {
  if (timeFormat === '12') {
    appLines.push('  var h12 = h % 12 || 12;');
    appLines.push('  var ampm = h < 12 ? " AM" : " PM";');
    appLines.push('  timeEl.text = h12 + ":" + m + ampm;');
  } else {
    appLines.push('  timeEl.text = h + ":" + m;');
  }
}
if (hasTime && showDate) {
  appLines.push('  dateEl.text = DAYS[d.getDay()] + " " + d.getDate() + " " + MONTHS[d.getMonth()];');
}
if (showStats) {
  appLines.push('  try { if (stepsEl) stepsEl.text = (today.adjusted.steps || 0) + " steps"; } catch(e) {}');
}
appLines.push('};');
fs.writeFileSync('app/index.js', appLines.join('\n'));

// resources/index.view
var yT = timePos === 'top' ? '14%' : timePos === 'center' ? '50%' : '86%';
var yD = timePos === 'top' ? '21%' : timePos === 'center' ? '57%' : '92%';
var viewLines = [];
viewLines.push('<svg class="background">');
viewLines.push('  <image href="photo.png" x="0" y="0" width="100%" height="100%" />');
if (showStats) {
  viewLines.push('  <text id="hrLabel" class="stat" x="30%" y="7%" text-anchor="middle" />');
  viewLines.push('  <text id="stepsLabel" class="stat" x="70%" y="7%" text-anchor="middle" />');
}
if (hasTime) {
  viewLines.push('  <rect id="overlay" class="overlay" />');
  viewLines.push('  <text id="timeLabel" class="time" x="50%" y="' + yT + '" text-anchor="middle" dominant-baseline="middle" />');
}
if (hasTime && showDate) {
  viewLines.push('  <text id="dateLabel" class="date" x="50%" y="' + yD + '" text-anchor="middle" dominant-baseline="middle" />');
}
viewLines.push('</svg>');
fs.writeFileSync('resources/index.view', viewLines.join('\n'));

// resources/styles.css
var ov = timePos === 'bottom' ? 'x: 0; y: 72%; width: 100%; height: 28%;'
       : timePos === 'top'    ? 'x: 0; y: 0; width: 100%; height: 28%;'
       : 'display: none;';
var css = '.time { font-size: 54; font-weight: bold; fill: white; }\n';
css += '.date { font-size: 20; fill: white; opacity: 0.85; letter-spacing: 2; }\n';
css += '.stat { font-size: 16; fill: white; opacity: 0.85; }\n';
css += '.overlay { ' + ov + ' fill: rgba(0,0,0,0.45); }\n';
fs.writeFileSync('resources/styles.css', css);

console.log('Generated source files for: ' + appName);
