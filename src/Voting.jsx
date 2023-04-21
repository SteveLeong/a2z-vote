import { useState, useEffect, Fragment, useContext } from 'react';
import {
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  deleteDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { Typography } from '@mui/material';

// import VoterView from './VoterView';
// import ResultsView from './ResultsView';
import { CollectionContext } from './firebase/Collection';

function Voting() {
  const [customAnswer, setCustomAnswer] = useState('');

  const { questions, collectionRef } = useContext(CollectionContext);

  // EDIT FUNCTION
  async function incrementTotal(question, index) {
    const updateAnswers = { answers: question.answers };
    ++updateAnswers.answers[index].total;

    try {
      const questionRef = doc(collectionRef, question.title);
      updateDoc(questionRef, updateAnswers);
    } catch (error) {
      console.error(error);
    }
  }

  async function addAnswer(question) {
    const updatedAnswers = { answers: question.answers };
    updatedAnswers.answers.push({ text: customAnswer, total: 1 });

    try {
      const questionRef = doc(collectionRef, question.title);
      updateDoc(questionRef, updatedAnswers);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Fragment>
      <div className='viewQuestions'>
        <h2>Voting View</h2>
        {questions.length == 0 ? <h1>Wait for the next question!</h1> : null}
        {questions.map((question) =>
          question.visible ? (
            <div className='question' key={question.title}>
              <h2>Title: {question.title}</h2>
              <p>Question: {question.question}</p>
              {question.answers.map((answer, index) => (
                <div key={index}>
                  <button onClick={() => incrementTotal(question, index)}>
                    {answer.text}
                  </button>
                </div>
              ))}
              {question.custom ? (
                <Fragment>
                  <input
                    type='text'
                    value={customAnswer}
                    onChange={(e) => setCustomAnswer(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      addAnswer(question);
                    }}
                  >
                    Submit
                  </button>
                </Fragment>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )
        )}
      </div>
    </Fragment>
  );
}

export default Voting;
