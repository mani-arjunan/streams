.PHONY: setup
setup:
	npm run start-db && sleep 10 && npm run insert-data

.PHONY: without-stream
without-stream:
	node delete.js && node without-stream.js

.PHONY: with-stream
with-stream:
	node delete.js && node with-stream.js

.PHONY: teardown
teardown:
	docker rm -f postgres && docker volume prune -a && docker image rm postgres
