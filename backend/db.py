from pymongo import MongoClient

uri = "mongodb+srv://olusmain:paR0r7oIQ82eM9PI@cluster0.ztby1wg.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri)

try:
    database = client.get_database("savespehere")
    movies = database.get_collection("products")
    res = movies.find_one({})
    print(res)

    client.close()

except Exception as e:
    raise Exception("Unable to find the document due to the following error: ", e)
