# IIC2173---API

**POST:  /api/signup**
```
{
	"email": "user@example.com",
	"password": "pswrd123"
}

200 =>  { "token": "eyq0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1OWZlM2ZiYTVmNWEyNTY1NGRmMWQ0NTMiLCJpYXQiOjE1MDk4MzQ2ODIzODR9.Hqn2U4KpdQfW9mLHiWja4Ra5RZeYa0KfWU86cQyOCh2" }

422 => {"error": "Error Message"}
```

**POST:  /api/signin**
```
{
	"email": "user@example.com",
	"password": "pswrd123"
}

200 =>  { "token": "eyq0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1OWZlM2ZiYTVmNWEyNTY1NGRmMWQ0NTMiLCJpYXQiOjE1MDk4MzQ2ODIzODR9.Hqn2U4KpdQfW9mLHiWja4Ra5RZeYa0KfWU86cQyOCh2" }

401 => Unauthorized
```

**POST:  /api/cart/**
```
HEADERS
Authorization: token

BODY

[
	{
		"product_id": "1",
		"amount": "1"
	},
		{
		"product_id": "2",
		"amount": "10"
	}
]

200 =>  {
					"1":1,
					"2":1,
					(product_id: 1 bought, 0 rejected or error)
				}



401 => Unauthorized
```
