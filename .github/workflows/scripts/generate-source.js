'use strict';
var fs = require('fs');
var crypto = require('crypto');

var raw = fs.readFileSync('build-request.json', 'utf8');
var req = JSON.parse(raw);
var timePos = req.timePos || 'bottom';
var timeFormat = req.timeFormat || '12';
var showDate = req.showDate !== false;
var showStats = req.showStats === true;
var appName = req.appName || 'My Photo Clock';
var hasTime = timePos !== 'none';
var uuid = crypto.randomUUID();

if (!fs.existsSync('app')) fs.mkdirSync('app', { recursive: true });
if (!fs.existsSync('resources')) fs.mkdirSync('resources', { recursive: true });
if (!fs.existsSync('build')) fs.mkdirSync('build', { recursive: true });

// package.json - SDK reads from the 'fitbit' key
var pkg = {
  name: 'my-photo-clock',
  version: '1.0.0',
  fitbit: {
    appUUID: uuid,
    appType: 'clockface',
    appDisplayName: appName,
    buildTargets: ['rhea'],
    requestedPermissions: showStats ? ['access_activity', 'access_heart_rate'] : [],
    defaultLanguage: 'en-US'
  }
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('package.json written, UUID: ' + uuid);

// app/index.js
var appLines = [];
appLines.push('import clock from "clock";');
if (showStats) {
  appLines.push('import { today } from "user-activity";');
  appLines.push('import { HeartRateSensor } from "heart-rate";');
}
appLines.push('import { getElementById } from "document";');
appLines.push('clock.granularity = "minutes";');
if (hasTime) appLines.push('var timeEl = getElementById("timeLabel");');
if (hasTime && showDate) appLines.push('var dateEl = getElementById("dateLabel");');
if (showStats) {
  appLines.push('var hrEl = getElementById("hrLabel");');
  appLines.push('var stepsEl = getElementById("stepsLabel");');
  appLines.push('if (HeartRateSensor) {');
  appLines.push('  var hrm = new HeartRateSensor();');
  appLines.push('  hrm.onreading = function() { if (hrEl) hrEl.text = "HR: " + (hrm.heartRate || "--"); };');
  appLines.push('  hrm.start();');
  appLines.push('}');
}
appLines.push('var DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];');
appLines.push('var MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];');
appLines.push('clock.ontick = function(evt) {');
appLines.push('  var d = evt.date;');
appLines.push('  var h = d.getHours();');
appLines.push('  var mins = d.getMinutes().toString();');
appLines.push('  if (mins.length < 2) mins = "0" + mins;');
if (hasTime) {
  if (timeFormat === '12') {
    appLines.push('  var h12 = h % 12 || 12;');
    appLines.push('  var ampm = h < 12 ? " AM" : " PM";');
    appLines.push('  if (timeEl) timeEl.text = h12 + ":" + mins + ampm;');
  } else {
    appLines.push('  if (timeEl) timeEl.text = h + ":" + mins;');
  }
}
if (hasTime && showDate) {
  appLines.push('  if (dateEl) dateEl.text = DAYS[d.getDay()] + " " + d.getDate() + " " + MONTHS[d.getMonth()];');
}
if (showStats) {
  appLines.push('  try { if (stepsEl) stepsEl.text = (today.adjusted.steps || 0) + " steps"; } catch(e) {}');
}
appLines.push('};');
fs.writeFileSync('app/index.js', appLines.join('\n'));

// resources/widget.defs - required by Fitbit SDK
var yT = timePos === 'top' ? '14%' : timePos === 'center' ? '50%' : '86%';
var yD = timePos === 'top' ? '21%' : timePos === 'center' ? '57%' : '92%';
var wdLines = [];
wdLines.push('<svg>');
wdLines.push('  <defs>');
wdLines.push('    <link rel="stylesheet" href="styles.css" />');
wdLines.push('    <image id="bg" href="photo.png" x="0" y="0" width="100%" height="100%" />');
if (showStats) {
  wdLines.push('    <text id="hrLabel" class="stat" x="30%" y="7%" text-anchor="middle" />');
  wdLines.push('    <text id="stepsLabel" class="stat" x="70%" y="7%" text-anchor="middle" />');
}
if (hasTime) {
  wdLines.push('    <rect id="overlay" class="overlay" />');
  wdLines.push('    <text id="timeLabel" class="time" x="50%" y="' + yT + '" text-anchor="middle" dominant-baseline="middle" />');
}
if (hasTime && showDate) {
  wdLines.push('    <text id="dateLabel" class="date" x="50%" y="' + yD + '" text-anchor="middle" dominant-baseline="middle" />');
}
wdLines.push('  </defs>');
wdLines.push('</svg>');
fs.writeFileSync('resources/widget.defs', wdLines.join('\n'));

// resources/index.view - references widget.defs
var viewLines = [];
viewLines.push('<svg class="background">');
viewLines.push('  <use href="#bg" />');
if (showStats) {
  viewLines.push('  <use href="#hrLabel" />');
  viewLines.push('  <use href="#stepsLabel" />');
}
if (hasTime) {
  viewLines.push('  <use href="#overlay" />');
  viewLines.push('  <use href="#timeLabel" />');
}
if (hasTime && showDate) {
  viewLines.push('  <use href="#dateLabel" />');
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

console.log('All source files generated OK for: ' + appName);
