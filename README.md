# Use case for Streams

This repo will setup a postgres db in local with `user` and `normalized_user` table, the scope is on setup
will create by default 500MB of records inside `user` table, our goal is to read from `user` table and do some
pretty complex(YESS) transformation and then feed that complexed data into `normalized_user` table.

## Prerequisites
Of course this repo, docker and node installed(>=20)

## How this works
I have done this in two ways, one typical way of selecting the whole data do the transformation and batch/bulk insert.
two is using the streams way.

## How to run
Clone this repo.
1. make setup
2. make without-stream.js
3. make with-stream.js

> [!NOTE]
> Just see the memory difference(Thats all i can say :()
