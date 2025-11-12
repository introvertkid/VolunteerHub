use spring_boot_db;

-- ======================
-- ROLES
-- ======================
alter table events
    add column status varchar(20) default 'PENDING' after end_at;

update events set status = 'PENDING' where status is null;