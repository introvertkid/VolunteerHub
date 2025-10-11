drop database if exists spring_boot_db;

create database spring_boot_db 
character set utf8mb4
collate utf8mb4_unicode_ci;

use spring_boot_db;

-- ======================
-- ROLES
-- ======================
create table roles(
	roleId int primary key auto_increment,
    name varchar(100) not null unique
);

-- ======================
-- USERS
-- ======================
create table users(
	userId int primary key auto_increment,
    roleId int not null,
    fullName varchar(255) not null,
    email varchar(100) unique not null,
    phoneNumber varchar(20) unique,
    password varchar(255) not null,
    createdAt datetime default current_timestamp,
    foreign key (roleId) references roles(roleId)
);

-- ======================
-- CATEGORIES
-- ======================
create table categories(
	categoryId int primary key auto_increment,
    categoryName varchar(100) not null unique
);

-- ======================
-- EVENTS
-- ======================
create table events(
	eventId int primary key auto_increment,
    title varchar(255) not null,
    description text,
    categoryId int,
    -- address field is for user input, city/district/ward is dropdown menu -- 
    address varchar(255) not null,
    city varchar(100),
    district varchar(100),
    ward varchar(100),
    startAt datetime,
    endAt datetime,
    createdBy int not null,
    foreign key (createdBy) references users(userId),
    foreign key (categoryId) references categories(categoryId)
);

-- ======================
-- EVENT REGISTRATIONS
-- ======================
create table event_registrations(
	registrationId int primary key auto_increment,
	userId int,
    eventId int,
    status varchar(20),
    registrationDate datetime default current_timestamp,
    cancelAt datetime,
    approvedBy int,
    foreign key (userId) references users(userId),
    foreign key (eventId) references events(eventId),
    foreign key (approvedBy) references users(userId)
);

-- ======================
-- POSTS
-- ======================
create table posts(
	postId int primary key auto_increment,
    eventId int,
    createdBy int,
    content text,
    createdDate datetime default current_timestamp,
    foreign key (eventId) references events(eventId),
    foreign key (createdBy) references users(userId)
);

-- ======================
-- COMMENTS
-- ======================
create table comments(
	commentId int primary key auto_increment,
    postId int,
    commentedBy int,
    content text not null,
    createdAt datetime default current_timestamp,
    foreign key (commentedBy) references users(userId),
    foreign key (postId) references posts(postId)
);

-- ======================
-- POST LIKES
-- ======================
create table post_likes(
	id int primary key auto_increment,
	userId int,
    postId int,
    foreign key (userId) references users(userId),
    foreign key (postId) references posts(postId)
);

-- ======================
-- EVENT LIKES
-- ======================
create table event_likes(
	id int primary key auto_increment,
	userId int,
    eventId int,
    foreign key (userId) references users(userId),
    foreign key (eventId) references events(eventId)
);

-- ======================
-- NOTIFICATIONS
-- ======================
create table notifications(
	notificationId int primary key auto_increment,
    userId int,
    message text not null,
    createdAt datetime default current_timestamp,
    isRead boolean default false,
    foreign key (userId) references users(userId)
);

-- ======================
-- REFRESH TOKEN BLACKLIST
-- ======================
create table refreshTokenBlackList(
	refreshTokenId int primary key auto_increment,
	userId int,
	jti varchar(255),
    createdAt datetime,
    expiresAt datetime,
    foreign key (userId) references users(userId)
);

insert into roles(name) values ('ROLE_VOLUNTEER'), ('ROLE_MANAGER'), ('ROLE_ADMIN');