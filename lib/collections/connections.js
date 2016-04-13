Connections = new Mongo.Collection('connections');

Connections.attachSchema(new SimpleSchema({
    userId: {
        type: String,
        max: 100
    },
    contacts: {
        type: Array,
        optional: true
    },
    "contacts.$": {
        type: Object
    },
    "contacts.$.userId": {
        type: String,
        max: 100
    },
    "contacts.$.phoneNo": {
        type: String,
        max: 15
    },
    "contacts.$.name": {
        type: String,
        max: 100
    },
    "contacts.$.name": {
        type: String
    },
    "contacts.$.verified": {
        type: Boolean,
        label: "isVerified"
    }
}));


