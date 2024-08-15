from flask import Flask, request, jsonify, render_template
import mysql.connector
import base64

mydb_config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': 'Nhreddy@05',
    'database': 'pets'
}

app = Flask(__name__, template_folder='templates', static_folder='templates/static')

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/create_account',methods=['POST'])
def createaccount():
    data=request.get_json()
    newusername=data.get('newusername')
    newemail=data.get('newemail')
    newpassword=data.get('newpassword')
    newnumber=data.get('newnumber')
    try:
        with mysql.connector.connect(**mydb_config) as mydb:
            cursor=mydb.cursor()
            query="insert into users (username,email,password1,mobile) values(%s,%s,%s,%s)"
            values=(newusername,newemail,newpassword,newnumber,)
            cursor.execute(query,values)
            mydb.commit()
            return jsonify({'status':'sucess'})
    except Exception as e:
        print("create_account",str(e))
        return jsonify({"status":"failure"})


@app.route('/add_adress', methods=['POST'])
def add_adress():
    data = request.get_json()
    email = data.get('Email')
    d_no = data.get('d_no')
    locality = data.get('locality')
    city = data.get('city')
    pincode = int(data.get('pincode'))
    state = data.get('state')

    try:
        with mysql.connector.connect(**mydb_config) as mydb:
            cursor = mydb.cursor()
            query = "INSERT INTO location (d_no, localty, city, pincode, state) VALUES (%s, %s, %s, %s, %s)"
            values = (d_no, locality, city, pincode, state)
            cursor.execute(query, values)
            mydb.commit()

            query = "SELECT locationId FROM location WHERE d_no = %s AND localty = %s AND city = %s AND pincode = %s AND state = %s"
            cursor.execute(query, values)
            result = cursor.fetchall()
            print(result)
            locid = result[0][0]
            print(locid)

            query = "SELECT userid FROM users WHERE email = %s"
            values = (email,)
            cursor.execute(query, values)
            print("userid",result)
            result = cursor.fetchall()
            userid = result[0][0]
            print(userid)

            query = "INSERT INTO user_locations (userid, locationid) VALUES (%s, %s)"
            values = (userid, locid)
            cursor.execute(query, values)
            mydb.commit()
            print("done")
            return jsonify({"status": "success"})

    except Exception as e:
        print("add_adress", str(e))
        return jsonify({"status": "failure"})
    
@app.route('/check_delivery',methods=['POST'])
def check_delivery():
    data=request.get_json()
    emailid=data.get('Email')
    petid=data.get('petId')
    locationid=data.get('locationId')
    try:
        with mysql.connector.connect(**mydb_config) as mydb:
            cursor=mydb.cursor()
            query="select userid from users where email=%s"
            values=(emailid,)
            cursor.execute(query,values)
            result=cursor.fetchall()
            userid=result[0][0]
            query="select pincode from location where locationid=%s"
            values=(locationid,)
            cursor.execute(query,values)
            result=cursor.fetchall()
            pincode=result[0][0]
            print("1.place_order",pincode)
            query="select seller_id from market where pet_id=%s"
            values=(petid,)
            cursor.execute(query,values)
            result=cursor.fetchall()
            sellerid=result[0][0]
            print("2.place_order",sellerid)
            query="select count(*) from deliveries where seller_id=%s and delivarable_pincode=%s"
            values=(sellerid,pincode,)
            cursor.execute(query,values)
            result=cursor.fetchall()
            print("3.place_order",result)
            if result[0][0]==0:
                
                return jsonify({"status":"can't delivere to your adress"})
            else:
                return jsonify({"status":"yes"})
    except Exception as e:
        print("check_delivery",str(e))
        return jsonify({"error":str(e)})
    

    
@app.route('/place_order',methods=['POST'])
def place_order():
    data=request.get_json()
    emailid=data.get('Email')
    petid=data.get('petId')
    locationid=data.get('locationId')
   
    paymentmode=data.get('paymentmode')
    c=0
    if paymentmode=="COD":
        c=1
    else:
        c=2
    
    transactionid=data.get('transactionId')
    try:
        with mysql.connector.connect(**mydb_config) as mydb:
            cursor=mydb.cursor()
            query="select pet_cost from pet_breed where pet_id=%s"
            values=(petid,)
            cursor.execute(query,values)
            result=cursor.fetchall()
            print("1.place_order",result)
            cost=result[0][0]
            query="select userid from users where email=%s"
            values=(emailid,)
            cursor.execute(query,values)
            result=cursor.fetchall()
            print("2.place_order",result)
            userid=result[0][0]
            query="select pincode from location where locationId=%s"
            values=(locationid,)
            cursor.execute(query,values)
            result=cursor.fetchall()
            print("3.place_order",result)
            pincode=result[0][0]
            print("1.place_order",pincode)
            query="select seller_id from market where pet_id=%s"
            values=(petid,)
            cursor.execute(query,values)
            result=cursor.fetchall()
            sellerid=result[0][0]
            print("2.place_order",sellerid)
            query="select count(*) from deliveries where seller_id=%s and delivarable_pincode=%s"
            values=(sellerid,pincode,)
            cursor.execute(query,values)
            result=cursor.fetchall()
            print("3.place_order",result)
            if result[0][0]==0:
                return jsonify({"status":"can't delivere to your adress"})
            else:
                if paymentmode!='COD':
                    query="select transaction_status from transactions where transactionid=%s"
                    values=(transactionid,)
                    cursor.execute(query,values)
                    result=cursor.fetchall()
                    transaction_status=result[0][0]
                    if transaction_status != True:
                        status="transaction failed"
                        return jsonify({"status":status})
                    else:
                        query = "INSERT INTO orders (userid, cost, pet_id, order_status, paymentmode, destination_adress_id) VALUES (%s, %s, %s, %s, %s, %s)"
                        values = (userid, cost, petid, "placed", paymentmode, locationid)
                        cursor.execute(query, values)
                        mydb.commit()
                        
                        query="delete from market where pet_id=%s"
                        values=(petid,)
                        cursor.execute(query,values)
                        result=cursor.fetchall()
                        mydb.commit()
                        status="sucess"
                        return jsonify({"status":status})
                else:
                    query = "INSERT INTO orders (userid, cost, pet_id, order_status, paymentmode, destination_adress_id) VALUES (%s, %s, %s, %s, %s, %s)"
                    values = (userid, cost, petid, "placed", paymentmode, locationid)
                    cursor.execute(query, values)
                    cursor.execute(query,values)
                    mydb.commit()
                    query="delete from market where pet_id=%s"
                    values=(petid,)
                    cursor.execute(query,values)
                    result=cursor.fetchall()
                    mydb.commit()
                    status="sucess"
                    return jsonify({"status":status})
    except Exception as e:
        print('place_order',str(e))
        return jsonify({"status":"failure"})


@app.route('/transaction',methods=['POST'])
def transaction():
    data=request.get_json()
    
    petid=data.get('petId')
    print("transaction",)
    email=data.get('Email')
    transactionmode=data.get('paymentmode')
    c=0
    if transactionmode=="COD":
        c=1
    else:
        c=2
    try:
        with mysql.connector.connect(**mydb_config) as mydb:
            cursor=mydb.cursor()
            query="select pet_cost from pet_breed where pet_id=%s"
            values=(petid,)
            cursor.execute(query,values)
            result=cursor.fetchall()
            print("1.transaction",result)
            amount=result[0][0]

            query="select userid from users where email=%s"
            values=(email,)
            cursor.execute(query,values)     
            result=cursor.fetchall()
            print("1.transaction",result)
            userid=result[0][0]
            query="insert into transactions (amount,pet_id,userid,transaction_mode,transaction_status)  values(%s,%s,%s,%s,%s)"
            values=(amount,petid,userid,c,True)
            cursor.execute(query,values)
            mydb.commit()
            query="select transactionid from transactions where pet_id=%s and userid=%s order by transaction_time asc"
            values=(petid,userid)
            cursor.execute(query,values)
            result=cursor.fetchall()
            print("2.transaction",result)
            id=result[0][0]
            return jsonify({"sucess":id})
    except Exception as e:
        print("transaction",str(e))
        return jsonify({"error":str(e)})


                   
@app.route('/addtocart', methods=['POST'])
def addtocart():
    data = request.get_json()
    email = data.get('email')
    pet_id = int(data.get('petId'))
    try:
        with mysql.connector.connect(**mydb_config) as mydb:
            cursor = mydb.cursor()
            print(email)
            print(pet_id)
            
            query = "SELECT userid FROM users WHERE email=%s"
            values = (email,)
            cursor.execute(query, values)
            result = cursor.fetchall()
            print("1.addtocart result", result)
            userid = result[0][0]
            userid = int(userid)
            query="select count(*) from cart where pet_id=%s and userid=%s"
            values=(pet_id,userid,)
            cursor.execute(query,values)
            result=cursor.fetchall()
            totalcount=int(result[0][0])
            if totalcount>0:
                return jsonify({"status": "success"})
            
            query = "INSERT INTO cart (pet_id, userid) VALUES (%s, %s)"
            
            values = (pet_id, userid,)
            cursor.execute(query, values)
            mydb.commit()
            print("3.addtocart result", result)
            query = "SELECT COUNT(*) AS count FROM cart WHERE userid=%s AND pet_id=%s"
            values = (userid, pet_id)
            cursor.execute(query, values)
            result = cursor.fetchall()
            print("4.addtocart result", result)
            c = result[0][0]
            c = int(c)
            if c > 0:
                print("sucess")
                return jsonify({"status": "success"})
            else:
                print("failure")
                return jsonify({"status": "failure"})
    except Exception as e:
        print("error addtocart", str(e))
        return jsonify({"error": str(e)}), 400
    
@app.route('/login', methods=['POST'])
def login():
    try:
        # Parse JSON data from request
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')  # Use 'password' key, not 'email'

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # Connect to MySQL database
        with mysql.connector.connect(**mydb_config) as mydb:
            cursor = mydb.cursor(dictionary=True)  # Use dictionary cursor for easier result handling
            query = "SELECT COUNT(*) AS count FROM users WHERE email = %s AND password1 = %s"
            values = (email, password)
            cursor.execute(query, values)
            result = cursor.fetchall() # Fetch a single row result
            print(result)
            print(result[0]['count'])
            if result[0]['count'] > 0:
                print("sucess")
                return jsonify({"status": "success"})
            else:
                print("failure")
                return jsonify({"status": "failure"})

    except mysql.connector.Error as e:
        print("MySQL Error:", str(e))
        return jsonify({"error": "Database error occurred"}), 500

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": "An unexpected error occurred"}), 500

    






@app.route('/initial_images', methods=['POST'])
def get_initial_image():
    try:
        with mysql.connector.connect(**mydb_config) as mydb:
            cursor = mydb.cursor()
            query = "SELECT pet_name, pet_cost, pet_pic, pet_id FROM pet_breed"
            cursor.execute(query)
            result = cursor.fetchall()
            print(result)

            # Encode binary data (pet_pic) to base64
            encoded_result = []
            for row in result:
                pet_name, pet_cost, pet_pic, pet_id = row
                query = "SELECT COUNT(*) FROM market WHERE pet_id = %s"
                values = (pet_id,)
                cursor.execute(query, values)
                count_result = cursor.fetchone()
                if count_result[0] > 0:
                    encoded_pic = base64.b64encode(pet_pic).decode('utf-8')
                    encoded_result.append([pet_name, pet_cost, encoded_pic, pet_id])

            print(encoded_result)
            return jsonify({'data': encoded_result})

    except Exception as e:
        print("Error connecting to MySQL Server", str(e))
        return jsonify({"error": str(e)}), 401
    
@app.route('/addtowhistlist',methods=['POST'])
def add_to_wishlist():
    data = request.get_json()
    email = data.get('email')
    pet_id = int(data.get('petId'))
    try:
        with mysql.connector.connect(**mydb_config) as mydb:
            cursor = mydb.cursor()
            print(email)
            print(pet_id)
            query = "SELECT userid FROM users WHERE email=%s"
            values = (email,)
            cursor.execute(query, values)
            result = cursor.fetchall()
            print("1.addtowhistlist result", result)
            userid = result[0][0]
            userid = int(userid)
            query = "INSERT INTO whistlist (pet_id, userid) VALUES (%s, %s)"
            values = (pet_id, userid)
            cursor.execute(query, values)
            mydb.commit()
            print("3.addtowhistlist result", result)
            query = "SELECT COUNT(*) AS count FROM whistlist WHERE userid=%s AND pet_id=%s"
            values = (userid, pet_id)
            cursor.execute(query, values)
            result = cursor.fetchall()
            print("4.addtowhistlist result", result)
            c = result[0][0]
            c = int(c)
            if c > 0:
                print("sucess")
                return jsonify({"status": "success"})
            else:
                print("failure")
                return jsonify({"status": "failure"})
    except Exception as e:
        print("error addtocart", str(e))
        return jsonify({"error": str(e)}), 400

@app.route('/get_result_images', methods=['POST'])
def get_result_images():
    data = request.get_json()
    pet_name = data['petName']
    
    try:
        with mysql.connector.connect(**mydb_config) as mydb:
            query = "SELECT pet_name,pet_cost, pet_pic, pet_id FROM pet_breed WHERE pet_name like CONCAT('%',%s,'%') GROUP BY pet_id"
            values = (pet_name,)
            
            print(values)
            cursor = mydb.cursor()
            cursor.execute(query, values)
            result = cursor.fetchall()
            print(result)
            number = len(result)
            print(number)
            if number > 0:
                print("Sending data successfully get_result_images")
                # Encode binary data (pet_pic) to base64
                encoded_result = []
                for row in result:
                    pet_name,pet_cost, pet_pic, pet_id = row

                    query = "SELECT COUNT(*) FROM market WHERE pet_id = %s"
                    values = (pet_id,)
                    cursor.execute(query, values)
                    count_result = cursor.fetchone()
                    if count_result[0] > 0:
                        encoded_pet_pic = base64.b64encode(pet_pic).decode('utf-8')
                        encoded_result.append((pet_name,pet_cost, encoded_pet_pic, pet_id))
                return jsonify({'data': encoded_result})
            else:
                print("Invalid pet_name get_result_images")
                e = "Invalid pet_name"
                return jsonify({"error": e})
    except Exception as e:
        print("Error connecting to MySQL Server", str(e))
        return jsonify({"error": str(e)}), 401
    
@app.route('/cart_items', methods=['POST'])
def cart_items():
    data = request.get_json()
    try:
        with mysql.connector.connect(**mydb_config) as mydb:
            email = data['email']
            query = "SELECT userid FROM users WHERE email=%s"
            values = (email,)
            cursor = mydb.cursor()
            cursor.execute(query, values)
            U = cursor.fetchall()
            print("1.cart_items",U)
            uid = U[0][0]
            print(uid)
            query = "SELECT cart.pet_id as pet_id, pet_breed.pet_pic as pet_pic,pet_breed.pet_cost as pet_cost,pet_breed.pet_name as pet_name FROM cart JOIN pet_breed ON pet_breed.pet_id = cart.pet_id WHERE cart.userid =%s "
            values = (uid,)
            cursor.execute(query, values)
            carts = cursor.fetchall()
            print("2.cart_items",carts)

            # Encode binary data (pet_pic) to base64
            data = []
            for row in carts:
                pet_id, pet_pic,pet_cost, pet_name= row
                encoded_pet_pic = base64.b64encode(pet_pic).decode('utf-8')
                data.append((pet_name, pet_cost,encoded_pet_pic, pet_id))
            print(data)
            print("sucess")
            return jsonify({'data': data})
    except Exception as e:
        print("sucess")
        print("Error connecting to MySQL Server",str(e))
        return jsonify({"error": str(e)}), 401

@app.route('/whistlist_items', methods=['POST'])
def whistlist_items():
    data = request.get_json()
    try:
        with mysql.connector.connect(**mydb_config) as mydb:
            email = data['email']
            query = "SELECT userid FROM users WHERE email=%s"
            values = (email,)
            cursor = mydb.cursor()
            cursor.execute(query, values)
            U = cursor.fetchall()
            uid = U[0][0]
            query = "SELECT whistlist.pet_id, pet_breed.pet_name, pet_breed.pet_pic FROM whistlist JOIN pet_breed ON pet_breed.pet_id = whistlist.pet_id WHERE whistlist.userid =%s"
            values = (uid,)
            cursor.execute(query, values)
            carts = cursor.fetchall()

            # Encode binary data (pet_pic) to base64
            encoded_carts = []
            for row in carts:
                pet_id, pet_name, pet_pic, count = row
              
                encoded_carts.append((pet_id, pet_name,count))

            return jsonify({"data": encoded_carts})
    except Exception as e:
        print("Error connecting to MySQL Server",str(e))
        return jsonify({"error": str(e)}), 401
    


@app.route('/get_pet_details',methods=['POST'])
def get_pet_details():
    data = request.get_json()
    petid=data.get('petId')
    try:
        with mysql.connector.connect(**mydb_config) as mydb:
            cursor=mydb.cursor()
            query="select pet_description,pet_age,pet_name from pet_data where pet_id=%s"
            values=(petid,)
            cursor.execute(query,values)
            result=cursor.fetchall()
            data=[]
            pet_details,pet_name,pet_age=result[0]
            data.append((pet_details,pet_name,pet_age))
            print(data)
            return jsonify({"data":data})
    except Exception as e:
        error=str(e)
        print("get_pet_details",e)
        return jsonify({"error":error}),401

    
@app.route('/get_pet_all_details',methods=['POST'])
def get_pet_all_details():
    data = request.get_json()
    petid=data.get('petId')
    try:
        with mysql.connector.connect(**mydb_config) as mydb:
            cursor=mydb.cursor()
            query="select pet_breed.pet_id,pet_breed.pet_cost,pet_breed.pet_name,pet_data.pet_name,pet_data.pet_description from pet_breed join pet_data on pet_data.pet_id=pet_breed.pet_id having pet_breed.pet_id=%s;"
            values=(petid,)
            cursor.execute(query,values)
            result=cursor.fetchall()
            data=[]
            for row in result:
                data.append([row[0],row[1],row[2],row[3],row[4]])
            return jsonify({"data":data})
    except Exception as e:
        print("get_pet_all_details",str(e))
        return jsonify({"error":str(e)}),401
    
@app.route('/get_location_details',methods=['POST'])
def get_location_details():
    data = request.get_json()
    locationid=data.get('locationId')
    try:
        with mysql.connector.connect(**mydb_config) as mydb:
            cursor=mydb.cursor()
            query="select *from location where locationId=%s"
            values=(locationid,)
            cursor.execute(query,values)
            result=cursor.fetchall()
            data=[]
            for row in result:
                data.append([row[1],row[2],row[3],row[4],row[5]])
            return jsonify({"data":data})
    except Exception as e:
        print("get_location_details",str(e))
        return jsonify({"error":str(e)}),401
            




@app.route('/total_addresses', methods=['POST'])
def get_total_addresses():
    data = request.get_json()
    email = data.get('Email')
    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        with mysql.connector.connect(**mydb_config) as mydb:
            cursor = mydb.cursor()
            query = "SELECT userid FROM users WHERE email = %s"
            values = (email,)
            cursor.execute(query, values)
            result = cursor.fetchall()

            if not result:
                return jsonify({"error": "User not found"}), 404

            userid = result[0][0]
            print("total_addresses", userid)

            query = """
            SELECT location.locationId, location.d_no, location.localty, location.city, location.pincode, location.state
            FROM user_locations
            JOIN location ON user_locations.locationid = location.locationid
            WHERE user_locations.userid = %s
            """
            values = (userid,)
            cursor.execute(query, values)
            result = cursor.fetchall()
            print(result)
            if len(result)==0:
                return jsonify({"data":"error"})
            data=[]

            for row in result:
                data.append([row[0],row[1],row[2],row[3],row[4],row[5]])

            print(data)
            return jsonify({"data": data})

    except Exception as e:
        error = str(e)
        print("total addresses", error)
        return jsonify({"error": error}), 500

#
#@app.route('buy_cart',methods=['POST'])
def buy_cart():
    data=request.json()
    email=data.get('email')
    paymentmode=data.get('paymentmode')
    locationid=data.get('locationid')
    if paymentmode!='COD':
        transactionid=data.get('transactionid')
    try:
        with mysql.connector.connect(**mydb_config) as mydb:
            cursor=mydb.cursor()
            query="select userid from users where email=%s"
            values=(email,)
            cursor.execute(query,values)
            result=cursor.fetchall()
            userid=result[0][0]
            print("buy_cart",userid)
            query="select  pet_id from cart where userid=%s"
            values=(userid,)
            cursor.execute(query,values)
            result=cursor.fetchall()
            for key in result:
                pet_id=key[0]

               
    except Exception as e:
        print("buy_cart",str(e))
        return jsonify("error",str(e)),404
    
@app.route('/get_orders', methods=['POST'])
def get_orders():
    data = request.get_json()
    email = data.get('Email')
    
    try:
        with mysql.connector.connect(**mydb_config) as mydb:
            cursor = mydb.cursor()
            
            # Fetch the user ID based on email
            query = "SELECT userid FROM users WHERE email = %s"
            values = (email,)
            cursor.execute(query, values)
            result = cursor.fetchone()  # Use fetchone to get a single result
            if not result:
                return jsonify({"error": "User not found"}), 404

            user_id = result[0]
            
            # Fetch the orders for the user
            query = "SELECT order_id, cost, pet_id, order_status, paymentmode, destination_adress_id FROM orders WHERE userid = %s"
            values = (user_id,)
            cursor.execute(query, values)
            orders = cursor.fetchall()
            
            data = []
            for row in orders:
                order_id, cost, pet_id, order_status, paymentmode, location_id = row
                
                # Fetch the pet name based on pet_id
                query = "SELECT pet_name FROM pet_breed WHERE pet_id = %s"
                values = (pet_id,)
                cursor.execute(query, values)
                pet_result = cursor.fetchone()
                pet_name = pet_result[0] if pet_result else None
                
                # Fetch the location details based on location_id
                query = "SELECT * FROM location WHERE locationId = %s"
                values = (location_id,)
                cursor.execute(query, values)
                location_result = cursor.fetchone()
                
                # Append the order details along with pet name and location to data
                order_data = {
                    "order_id": order_id,
                    "cost": cost,
                    "pet_name": pet_name,
                    "order_status": order_status,
                    "payment_mode": paymentmode,
                    "location": location_result
                }
                data.append(order_data)
            print("get_orders sucess")
            return jsonify({"data": data})
    
    except Exception as e:
        print("get_orders", str(e))
        return jsonify({"error": str(e)}), 404







if __name__ == '__main__':
    app.run(debug=True)