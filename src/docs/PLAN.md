# School Payment Portal

> One-liner: School Payment Portal is a web application that allow a primary school's administrator to invoice the guardians of their students to collection payment for events, clubs, sponsorships, fund-raisers, equipment, etc.. Those payments can be done via cc using WiPay or with a local bank transfer, and easily reconciled in their accounting software, while providing notifications to the guardian at each steps of the process of collecting payment.

## Status

- Owner: Sheldon Hall
- Last updated: 01/08/2026
- Stage: Draft
- Location: Trinidad & Tobago
- Version: V0.1
- Links: N/A

---

## Goals & Non-Goals

### Goals

- [ ] The project is an MVP so this should run as cheaply as possible and have a max possible monthly cost of $150 USD which includes some DevOps
- [ ] ETL of existing students, guardians, teachers, payment items, etc (maybe could be done manually)
- [ ] Manage (CRUD) of school, teachers, students, their guardians, payment backets (any collection of new term fees, field trips, events, clubs, donations, fund-raisers, raffles, school supplies, equipment, other payment item).
- [ ] Ability to search/filter on all the elements above
- [ ] Notifications of new payment item that gets sent to guardian.
- [ ] Guardian can view the package or payment item a payment is being requested for.
- [ ] Notification of payment received
- [ ] Notifications will be via email or whatsapp
- [ ] Facilitate payment via bank transfer and cc payment
- [ ] Import payment transactions from WiPay
- [ ] Import payment transactions from local bank
- [ ] Reconcile payments
- [ ] View all the student payments for a payment item
- [ ] Export payments to Peachtree
- [ ] Reminder notifications of payment that hasn't been complete.
- [ ] Manual payment reconciliation
- [ ] Response design for Mobile, tablet, full size screen

### Non-Goals

- [ ] Login should be standard username/password and supporting stories (forget password), no OAuth login
- [ ] No MFA required in this version
- [ ] Have no social media elements like friends list, liking content, resharing, picture gallery, etc.

---

## Problem Statement

- Context: School payments management and reconciliation.
- Target: School administrators, guardians of the student.
- Triggers/entry points: School creates a payment item and adds students that can participate in it.

## Problem Details

In Trinidad and Tobago there exists a problem when trying to handle payments online via a web application, it's difficult for many citizens to get a cc, or to get a cc with a comfortable limit or even for businesses to get a merchant account and payment processor to collect cc payments online. Due to these reasons (and others), many people and businesses, handle payments via direct bank to bank transfers. This does help and after a bank transfer is made, the receipt is usually sent back to the payee. This does work but it presents some core challenges:

- It's hard to reconcile money received with the actual item(s) being purchased or actual service(s) being paid for.
- Fraud can happen where fake payment receipts are sent to the payee and they may mark the transaction as paid when it wasn't
- Hard to get transactions of payments in accounting software
  This problem exists for many different types of businesses but I'll like to focus on one type today. There is a prestigious catholic board school in Trinidad and Tobago and I'd like to create a portal for them to manage different payments that the guardian of students need to make. These payments van be wither cc payment via WiPay (they already have this but not in a website) and a solution for direct bank transfers that gets around the core challenges above. To this end, I would like to create a school payment portal with the goals defined above. I need your help to come up with a proposal that I can use in a meeting with the principal of that school. This would be an initial meeting so I don't want a proposal that's too complicated, too large and hard to get through, especially for non technical people.
