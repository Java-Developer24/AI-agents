export function addDefaultQuestions(state) {
  state.questions = [
    {
      type: "text",
      title: "OHR ID"
    },
    {
      type: "choice",
      title: "Select your Supervisor name",
      choices: [
        "Deepika",
        "Sangeetha",
        "Sohail",
        "Rajitha",
        "MK Saketh",
        "Jainam",
        "Kasamollu Kalyan Chetty",
        "Sunitha K",
        "Amrutha J",
        "Sanjo Jose",
        "Rohit S",
        "Ravindra Kamble",
        "Vineeth Thimmapurapu",
        "Ravi Mishra",
        "Chandrasekhar palem",
        "Abdul Rahman",
        "Ashish",
        "Rahul Radhavaram",
        "Prashanth Agarwal",
        "Sangeetha, Mokirala",
        "Rohit Nikhilson",
        "Rohith kolluri",
        "Sangeeta Bhuyan",
        "Vincy, Vijay",
        "Vennam Srikanth",
        "Anish Kumar",
        "Shanthi Priya",
        "Prashanth G",
        "Shaik Shoaib",
        "Atree Chaudhuri",
        "Prakasham Mallaram",
        "Ranjan Sagar Naidu",
        "Aryan dubey",
        "Srikanth Janga"
      ]
    }
  ];

  return state;
}
