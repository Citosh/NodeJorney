create table users(
login varchar(30) not null unique,
password varchar(255) not null,
role varchar(10) not null default 'user',
accesstoken varchar(255),
refreshtoken varchar(255));

insert into user1( login, password, role) values ( 'admin', 'admin', 'admin');

create table goods(
id bigint not null primary key,
name varchar(30) not null,
cost numeric(10,2) not null,
quantity numeric(10,0) default 0);
insert into products1( name, cost, quantity) values ( 'Apple', '10.2', '1000');

create table purchase_history1(
nameofuser varchar(10) not null,
nameofgoods varchar(30) not null,
quantity numeric(10,0) not null,
date date not null);