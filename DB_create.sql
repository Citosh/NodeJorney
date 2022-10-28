create table users(
login varchar(30) not null unique,
password varchar(255) not null,
role varchar(10) not null default 'user',
accesstoken varchar(255),
refreshtoken varchar(255));

insert into users (login,password,role) values ('admin','$2b$10$YdKZsSE07BfQ.Ir4yc7OBOGMxucpyFc7nCaZQAXp/kBZoeGSZur5u','admin');

create table goods(
id bigserial not null primary key,
name varchar(30) not null,
cost numeric(10,2) not null,
quantity numeric(10,0) default 0);

insert into goods (name,cost,quantity) values ('apple', 1.2, 100);

create table purchase(
nameofuser varchar(10) not null,
nameofgoods varchar(30) not null,
quantity numeric(10,0) not null,
date date not null);