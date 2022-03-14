const mongoose = require("mongoose");

const PersonelSchema = new mongoose.Schema({
  
  PersonelName: {
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        required: true
    }
},
DateOfAdmission: {
    type: Date,
    required: true
},
Status: {
    type: String,
    default: 'aktif',
    enum: ['aktif', 'pasif'],
    required: true,
},
Email: {
    type: String,
    required: true
},
Address: [{
    AddrType: {
        type: String,
        required: true,
        trim: true,

    },
    City: {
        type: String,
        required: true
    },
    State: {
        type: String,
        required: true
    },
    PostalCode: {
        type: String,
        required: true
    },
    Country: {
        type: String,
        required: true
    }
}],
Contact: [{
ContactType: {
    type: String,
    required: true,
    trim: true,

},
Value: {
    type: String,
    required: true,

}
}],
Department: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Department',
},
User: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
},
});

  module.exports = mongoose.model('Personel', PersonelSchema)