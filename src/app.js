const express = require('express');
const path = require('path');
const port = process.env.PORT || 8000
const app = express();
const hbs = require("hbs")
require("./db/conn")
const creationmodel = require("./models/schema")
const ptaFormSchema = require("./models/ptaschema")
const multer = require('multer');


async function generateSerialNumber() {
  try {
    const totalRecords = await creationmodel.countDocuments(); // Get the total number of records
    const serialNumber = totalRecords + 1; // Increment by 1 for the new entry
    return serialNumber;
  } catch (err) {
    console.error("Error generating serial number: ", err);
    throw err;
  }
}


// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function(req, file, cb)  {
        cb(null, path.join(__dirname, "../uploads")); // Directory to save uploaded files
    },
    filename: function(req, file, cb)  {
        cb(null, Date.now() + "-" + file.originalname); // Unique file name
    }
});

const upload = multer({ storage: storage });

// Middleware to parse form data
app.use(express.urlencoded({ extended: true })); // For form data
app.use(express.json()); // For JSON data (if needed)
// Serve static files from the 'public' directory
const static_path= (path.join(__dirname , "../public"))
const template_path =(path.join(__dirname , "../templates/views"))
const partial_path = (path.join(__dirname ,"../templates/partials"))

// console.log(static_path) 

app.use("/uploads",express.static(path.join(__dirname, '../uploads')))

app.use(express.static(static_path))
app.set("view engine" , "hbs")
app.set("views" ,template_path)
hbs.registerPartials(partial_path)
hbs.registerHelper('formatDate', function (date) {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Returns 'YYYY-MM-DD'
});

 
app.post('/login', (req, res) => {
    res.send('Login form submitted.');
}); 

app.get('/1year', (req, res) => {
    res.render("BA/1year");
});
app.get('/2year', (req, res) => {
    res.render("BA/2year");
});
app.get('/3year', (req, res) => {
    res.render("BA/3year");
});


app.get('/index', (req, res) => {
    res.render("index");
});

app.get('/login', (req, res) => {
    res.render("login")
});

app.get("/preview", async (req, res) => {
    try {
        // Fetch ALL students' data
        const allStudents = await creationmodel.find();

        if (!allStudents || allStudents.length === 0) {
            return res.status(404).send("No student data found.");
        }

        // Pass the array to the template
        res.render("preview", { students: allStudents });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});



app.get("/pta" , (req,res) =>{
    res.render("pta")
})

app.post('/submit-pta', upload.fields([
    { name: 'parent_photo', maxCount: 1 },
    { name: 'parent-hashtakshar', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const formData = new ptaFormSchema({
        parentName: req.body.parent_name,
        wardName: req.body.name_ofward, 
        class: req.body.class,
        rollNo: req.body.roll_no,
        wardSubject: req.body.ward_subject,
        occupation: req.body.occupation_ofguardian,
        address: req.body.address,
        telephone: req.body.telephone_no,
        parentPhoto: req.files['parent_photo']? req.files["parent_photo"][0].path:null,
        parentSignature: req.files['parent-hashtakshar']? req.files["parent-hashtakshar"][0].path:null
      });
  
      await formData.save();
      res.status(200).render("./index");
    } catch (err) {
      console.error(err);
      res.status(500).send('Error submitting form.');
    }
  });
  

app.get("/form" , (req, res) =>{
    res.render("form")
});

function safeNumber(value, fallback = 0) {
    const num = parseFloat(value);
    return isNaN(num) ? fallback : num;
  }
  

app.post("/submit-form", upload.fields([
    { name: "passport_photo", maxCount: 1 },
    { name: "signature_photo", maxCount: 1 }
]), async (req, res) => {
    try {
        const serialNumber = await generateSerialNumber();

        const caddress = req.body.correspondence_address;
        const paddress = req.body.permanent_address;

        const graduationDetails = {
            semester: safeNumber(req.body.graduation_semester),
            year: safeNumber(req.body.graduation_year),
            roll_no: safeNumber(req.body.graduation_roll_no),
            division: Array.isArray(req.body.graduation_division)
              ? req.body.graduation_division.join(', ')
              : req.body.graduation_division || "N/A",
            sgpa: safeNumber(req.body.graduation_sgpa),
            cgpa: safeNumber(req.body.graduation_cgpa),
            board: Array.isArray(req.body.graduation_board)
              ? req.body.graduation_board.join(', ')
              : req.body.graduation_board || "N/A",
            subjects: Array.isArray(req.body.graduation_subjects)
              ? req.body.graduation_subjects.join(', ')
              : req.body.graduation_subjects || "N/A"
          };
          
        



        if (caddress === paddress) {
            const registerData = new creationmodel({
                serial_number: serialNumber,
                roll_number: req.body.roll_number,
                university_roll: req.body.university_roll,
                university_reg: req.body.university_reg,
                course: req.body.course,
                student_name: req.body.student_name,
                father_name: req.body.father_name,
                mother_name: req.body.mother_name,
                student_phone: req.body.student_phone,
                dob: req.body.dob,
                email: req.body.email,
                aadhaar: req.body.aadhaar,
                b_group: req.body.blood_group,
                category: req.body.category,
                sub_category: req.body.sub_category,
                passport_photo: req.files["passport_photo"]  ? "uploads/" + req.files["passport_photo"][0].filename  : null,
                signature_photo: req.files["signature_photo"] ? "uploads/" + req.files["signature_photo"][0].filename : null,             
                correspondence_address: req.body.correspondence_address,
                permanent_address: req.body.permanent_address,
                bank_name: req.body.bank_name,
                account_no: req.body.account_no,
                ifsc: req.body.ifsc,
                selectedSubjects: req.body.selectedSubjects,
                
                matriculation: {
                        year: req.body.matriculation_year,
                        roll_no: req.body.matriculation_roll_no,
                        division: req.body.matriculation_division,
                        sgpa: req.body.matriculation_sgpa,
                        cgpa: req.body.matriculation_cgpa,
                        board: req.body.matriculation_board,
                        subjects: req.body.matriculation_subjects
                    },
                    twelfth: {
                        year: req.body.twelfth_year,
                        roll_no: req.body.twelfth_roll_no,
                        division: req.body.twelfth_division,
                        sgpa: req.body.twelfth_sgpa,
                        cgpa: req.body.twelfth_cgpa,
                        board: req.body.twelfth_board,
                        subjects: req.body.twelfth_subjects
                    },
                semesters: [graduationDetails]
                
                
            });

            await registerData.save();
            res.status(201).render("./preview" , {students: [registerData]}); // Redirect to the preview page
        } else {
            res.status(400).render("./error")
                
            
        }
    } catch (err) {
        res.status(500).render("error");
        console.log(err);
    }
});


// Start the server
app.listen(port, () => { 
    console.log(`Server is running on port no : ${port}`);
});


