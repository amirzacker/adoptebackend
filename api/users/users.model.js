const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = Schema({
  firstname: {
    type: String,
    require: false
  },
  lastname: {
    type: String,
    require: false
  },
  date: {
    type: Date,
    require: false
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  cv: {
    type: String,
    default: "",
  },
  motivationLetter: {
    type: String,
    default: "",
  },
  searchType: {
    type: Schema.Types.ObjectId,
    ref: "SearchType",
    autopopulate: true
  },
  domain: {
    type: Schema.Types.ObjectId,
    ref: "Domain",
    autopopulate: true
  },
  startDate: {
    type: Date,
    require: false
  },
  endDate: {
    type: Date,
    require: false
  },
  isAdopted: {
    type: Array,
    default: [],
  },
  adoptions: {
    type: Array,
    default: [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
    immutable: true
  },
  isStudent: {
    type: Boolean,
    default: false,
    immutable: true
  },
  isCompany: {
    type: Boolean,
    default: false,
    immutable: true
  },
  name: {
    type: String,
    max: 50,
  },
  desc: {
    type: String,
    max: 50,
  },
  city: {
    type: String,
    max: 50,
  },
  
}, { timestamps: true } );


userSchema.pre("save", async function () {
  this.email = this.email.toLowerCase();
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.plugin(require('mongoose-autopopulate'));
module.exports = model("User", userSchema);
