# BRN PR Board — Backend Contract

ห้ามเปลี่ยน Firebase project `brn-pr-board` หรือ Cloud Functions เดิม

- Authentication: Google admin `thanawid@gmail.com` และ staff `pr01`–`pr05` ผ่าน `@brn.local`
- Firestore งานทีม: collection `prEvents`
- LINE queue: collection `lineOutbox`
- LINE group: document `system/lineGroup`
- Cloud Functions ที่ล็อกไว้: `lineWebhook`, `sendLineOutbox`

Frontend จะเขียนงานเข้า `prEvents` และสร้างเอกสารใหม่ใน `lineOutbox` เมื่อเลือกแจ้ง LINE

Reminder default:
- New and edited `prEvents` include `reminderEnabled`, `reminderPolicy: "default"`, `reminderTimezone: "Asia/Bangkok"`, and `reminders`.
- Default `reminders` are `day_before` at `08:00` with `daysBefore: 1`, and `event_morning` at `07:00` with `daysBefore: 0`.
- Scheduled Cloud Functions can read these fields and enqueue reminder messages into `lineOutbox` without changing the existing LINE sender.


V1.2.0 เพิ่มฟิลด์ optional ใน `prEvents`:
- `requestSource`: ค่า `request_form` เมื่อมาจากแบบแจ้งงาน
- `prTasksOther`: รายละเอียดงานประชาสัมพันธ์อื่น ๆ

แบบแจ้งงานใช้สิทธิ์ผู้ใช้ที่เข้าสู่ระบบและบันทึกตรงเข้า `prEvents` โดยไม่สร้างขั้นอนุมัติใหม่
