from pymongo import MongoClient

uri = "mongodb+srv://connectorcluster.u9oh4pa.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=ConnectorCluster"
client = MongoClient(uri,
                     tls=True,
                     tlsCertificateKeyFile='./app/db_key/X509-cert-242526935876699516.pem')

try:
    client.ConDB2Adm.command("ping")
except Exception as e:
    print(e)

db = client.conversations
collection_name = db["conversations"]
