drop database if exists spring_boot_db;

create database spring_boot_db
    character set utf8mb4
    collate utf8mb4_unicode_ci;

use spring_boot_db;

-- ======================
-- ROLES
-- ======================
create table roles (
                       role_id int primary key auto_increment,
                       name varchar(100) not null unique
);

-- ======================
-- USERS
-- ======================
create table users (
                       user_id int primary key auto_increment,
                       role_id int not null,
                       full_name varchar(255) not null,
                       email varchar(100) unique not null,
                       phone_number varchar(20) unique,
                       password varchar(255) not null,
                       created_at datetime default current_timestamp,
                       foreign key (role_id) references roles(role_id)
);

-- ======================
-- CATEGORIES
-- ======================
create table categories (
                            category_id int primary key auto_increment,
                            category_name varchar(100) not null unique
);

-- ======================
-- EVENTS
-- ======================
create table events (
                        event_id int primary key auto_increment,
                        title varchar(255) not null,
                        description text,
                        category_id int,
    -- address field is for user input, city/district/ward is dropdown menu --
                        address varchar(255) not null,
                        city varchar(100),
                        district varchar(100),
                        ward varchar(100),
                        start_at datetime,
                        end_at datetime,
                        created_by int not null,
                        foreign key (created_by) references users(user_id),
                        foreign key (category_id) references categories(category_id)
);

-- ======================
-- EVENT REGISTRATIONS
-- ======================
create table event_registrations (
                                     registration_id int primary key auto_increment,
                                     user_id int,
                                     event_id int,
                                     status varchar(20),
                                     registration_date datetime default current_timestamp,
                                     cancel_at datetime,
                                     approved_by int,
                                     foreign key (user_id) references users(user_id),
                                     foreign key (event_id) references events(event_id),
                                     foreign key (approved_by) references users(user_id)
);

-- ======================
-- POSTS
-- ======================
create table posts (
                       post_id int primary key auto_increment,
                       event_id int,
                       created_by int,
                       content text,
                       created_date datetime default current_timestamp,
                       foreign key (event_id) references events(event_id),
                       foreign key (created_by) references users(user_id)
);

-- ======================
-- COMMENTS
-- ======================
create table comments (
                          comment_id int primary key auto_increment,
                          post_id int,
                          commented_by int,
                          content text not null,
                          created_at datetime default current_timestamp,
                          foreign key (commented_by) references users(user_id),
                          foreign key (post_id) references posts(post_id)
);

-- ======================
-- POST LIKES
-- ======================
create table post_likes (
                            id int primary key auto_increment,
                            user_id int,
                            post_id int,
                            foreign key (user_id) references users(user_id),
                            foreign key (post_id) references posts(post_id)
);

-- ======================
-- EVENT LIKES
-- ======================
create table event_likes (
                             id int primary key auto_increment,
                             user_id int,
                             event_id int,
                             foreign key (user_id) references users(user_id),
                             foreign key (event_id) references events(event_id)
);

-- ======================
-- NOTIFICATIONS
-- ======================
create table notifications (
                               notification_id int primary key auto_increment,
                               user_id int,
                               message text not null,
                               created_at datetime default current_timestamp,
                               is_read boolean default false,
                               foreign key (user_id) references users(user_id)
);

-- ======================
-- REFRESH TOKEN BLACKLIST
-- ======================
create table refresh_token_blacklist (
                                         refresh_token_id int primary key auto_increment,
                                         user_id int,
                                         jti varchar(255),
                                         created_at datetime,
                                         expires_at datetime,
                                         foreign key (user_id) references users(user_id)
);

-- ======================
-- DEFAULT ROLE DATA
-- ======================
insert into roles (name)
values ('ROLE_VOLUNTEER'), ('ROLE_MANAGER'), ('ROLE_ADMIN');
