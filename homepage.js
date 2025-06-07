import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import{getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js"


document.getElementById('prevBtn').addEventListener('click', prevQuestion);
document.getElementById('nextBtn').addEventListener('click', nextQuestion);
document.getElementById('submitBtn').addEventListener('click', submitQuiz);


const firebaseConfig = {
    //YOUR COPIED FIREBASE PART SHOULD BE HERE
 //WATCH THIS VIDEO TO LEARN WHAT TO PUT HERE   https://youtu.be/_Xczf06n6x0
 apiKey: "AIzaSyAoCbPpUEsr1AwEdYdjnXzhoRQOBYQVPQw",
    authDomain: "login-form2-9a1e4.firebaseapp.com",
    projectId: "login-form2-9a1e4",
    storageBucket: "login-form2-9a1e4.firebasestorage.app",
    messagingSenderId: "905017223490",
    appId: "1:905017223490:web:022be9faad236d1dbc00db"
  };
 
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const auth=getAuth();
  const db=getFirestore();

  onAuthStateChanged(auth, (user)=>{
    const loggedInUserId=localStorage.getItem('loggedInUserId');
    if(loggedInUserId){
        // console.log(user);
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap)=>{
            if(docSnap.exists()){
                const userData=docSnap.data();
                document.getElementById('loggedUserFName').innerText=userData.firstName;
                document.getElementById('loggedUserEmail').innerText=userData.email;
                document.getElementById('loggedUserLName').innerText=userData.lastName;
                document.getElementById('loggedUserPassword').innerText=userData.password;


            }
            else{
                console.log("no document found matching id")
            }
        })
        .catch((error)=>{
            console.log("Error getting document");
        })
    }
    else{
        console.log("User Id not Found in Local storage")
    }
  })

  const logoutButton=document.getElementById('logout');

  logoutButton.addEventListener('click',()=>{
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
    .then(()=>{
        window.location.href='index.html';
    })
    .catch((error)=>{
        console.error('Error Signing out:', error);
    })
  })
  const correctAnswers = ["A", "B", "C", "B", "B"];
  let currentQuestion = 0;
  let score = 0;
  const containers = document.querySelectorAll('.question-container');
  const navigation = document.getElementById('navigation');
  const scoreContainer = document.getElementById('score-container');
  const submittedQuestions = new Set();

  function showQuestion(index) {
    containers.forEach((container, i) => {
      container.classList.toggle('active', i === index);

      if (i === index && submittedQuestions.has(i)) {
        updateQuestionFeedback(i);
      }
    });
  }

  function updateQuestionFeedback(i) {
    const container = containers[i];
    const selected = container.querySelector('input[type="radio"]:checked');
    const result = container.querySelector('.result');
    const explanation = container.querySelector('.explanation');
    const scoreStatus = container.querySelector('.score-status');

    if (selected) {
      if (selected.value === correctAnswers[i]) {
        result.innerHTML = '✔ Correct';
        result.className = 'result correct';
      } else {
        result.innerHTML = '❌ Wrong. Correct answer: ' + correctAnswers[i];
        result.className = 'result wrong';
        explanation.style.display = 'block';
      }
    } else {
      result.innerHTML = '❌ No answer selected.';
      result.className = 'result wrong';
      explanation.style.display = 'block';
    }

    scoreStatus.textContent = `Current Score: ${score} / ${correctAnswers.length}`;
  }

  function nextQuestion() {
    if (currentQuestion < containers.length - 1) {
      currentQuestion++;
      showQuestion(currentQuestion);
    }
  }

  function prevQuestion() {
    if (currentQuestion > 0) {
      currentQuestion--;
      showQuestion(currentQuestion);
    }
  }

  function submitQuiz() {
    if (!submittedQuestions.has(currentQuestion)) {
      const container = containers[currentQuestion];
      const selected = container.querySelector('input[type="radio"]:checked');
      const result = container.querySelector('.result');
      const explanation = container.querySelector('.explanation');
      const scoreStatus = container.querySelector('.score-status');

      if (selected) {
        if (selected.value === correctAnswers[currentQuestion]) {
          result.innerHTML = '✔ Correct';
          result.className = 'result correct';
          score++;
        } else {
          result.innerHTML = '❌ Wrong. Correct answer: ' + correctAnswers[currentQuestion];
          result.className = 'result wrong';
          explanation.style.display = 'block';
        }
      } else {
        result.innerHTML = '❌ No answer selected.';
        result.className = 'result wrong';
        explanation.style.display = 'block';
      }

      submittedQuestions.add(currentQuestion);
      scoreStatus.textContent = `Current Score: ${score} / ${correctAnswers.length}`;

      if (submittedQuestions.size === containers.length) {
        scoreContainer.style.display = 'block';
        scoreContainer.innerText = `Congratulations!!
        You Scored: ${score} out of ${correctAnswers.length}`;
      }
    }
  }

  // Initial display
  showQuestion(currentQuestion);
  
  