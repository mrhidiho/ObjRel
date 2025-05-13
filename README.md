# ObjRel

bash:
docker-compose up --build

# REST API Reference

Base URL: `http://localhost:3001`

## Companies

| Endpoint | Method | Body | Description |
|----------|--------|------|-------------|
| /companies | GET | – | List all companies |
| /companies | POST | `{ "name": "Acme" }` | Create company |
| /companies/{id} | GET | – | Get single company |
| /companies/{id} | PUT | `{ "name": "New" }` | Update company |
| /companies/{id} | DELETE | – | Delete company |
| /companies/{id}/tree | GET | – | Company with nested contacts and activities |


## Contacts

| Endpoint | Method | Body / Query | Description |
|----------|--------|--------------|-------------|
| /contacts | GET | `?companyId=1` optional | List contacts |
| /contacts | POST | `{ "firstName":"Jane","lastName":"Doe","email":"","phone":"","companyId":1 }` | Create contact |
| /contacts/{id} | GET / PUT / DELETE | – / partial | CRUD single contact |
| /contacts/{id}/activities | GET | – | List activities for a contact |
| /contacts/{id}/activities | POST | `{ "type":"call","notes":"Follow up" }` | Add activity |



