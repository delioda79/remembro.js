# README #
Remembro is a database engine written in JS (Node.js) which was firstly created in order to "enhance" a simple JS object when a lot of data had to be stored and retrieved from memory in ana application I was working to. As I needed to be able to actually search for some element in this object I thought to actually create a db engine for node.js. There's plenty of them available and maybe more performant but I carried on, slowly, with this idea to see where it would bring me to. At the moment the software is able to run a server listening to a fixed port, accepting data in a specifi format and sendiing back data in teh same format which is <int>data where <int> is the length of the string and 'data'  is a json object representing the query result. It is possible at the moment to create a database, create a collection inside the database and search for items trhough simple match or set of matches criteria. The plan of action is to enhance the search criterias, add storage engines (at th emoment is only in memory) and then to add "triggers", which will be used in order to send informations to the client. Essentially the aim is that the client will be connected to the socket and will keep the connetcion open, it will register is interest on some changes, and whenever this changes happen the database engine will notify the client.
In my mind remembro will be used as in app storage, like i.e. the zope database, so to create some kind of platform for node.js to develop apps. On teh other side a storage engine for remembro could even be a MySql instance etc, not really sure about this, however I'm hoping to find poeple interested in helping me as alone I'm working to thsi project about once a month and I will never finish it. 