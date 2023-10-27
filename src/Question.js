import React, { useState } from 'react';
import './Question.css';
import axios from 'axios'; // Import Axios
import { useEffect } from 'react';



const ValueCreator = [
    {
        name: 'blog or quarter',
        questions: [
            'Number of blogs published',
            'Review',
            'Number of blogs progress'
        ]
    },
    {
        name: 'Certification -2 per cycle 1 Cloud and 1 Management',
        questions: [
            'Got the certificate',
            'Attended for the exam',
            'Attended for training'

        ]
    },
    {
        name: 'Reusable assets creation by self or team-1 per month',
        questions: [
            'Number of reusable assets completed',
            'Number of assets in progress'
        ]
    },
    {
        name: 'Webinar 1 per 1 quater',
        questions: [
            'Number of Webinars given',
            'Webinars in progress'
        ]
    },
    {
        name: 'Case study 8 per year',
        questions: [
            'Case studies completed',
            'Case study in progress'
        ]
    },
];

const initialQuestions = ValueCreator.map((category, index) => ({
    
    id: index + 1,
    category: category.name,    
    questions: category.questions.map((question, questionIndex) => {
      let initialRating = 0;
let initialQuantityTarget = 0;
let initialQuantityAchieved = 0; // Add this line
let initialIndexRating = 0; // Add this line
// console.log('Category Name:', category.name); // Debug
// console.log('Category Questions:', category.questions);
if (category.name === 'blog or quarter') {
    if (questionIndex === 0) {
        initialQuantityTarget = 5;
        initialQuantityAchieved = 0; // Set the initial quantity achieved
        initialIndexRating = 4; // Set the initial index rating
    } else if (questionIndex === 1) {
        initialQuantityTarget = 0;
        initialQuantityAchieved = 0;
        initialIndexRating = 0;
    } else if (questionIndex === 2) {
        initialQuantityTarget = 1;
        initialQuantityAchieved = 0;
        initialIndexRating = 0;
    }
}
         else if (category.name === 'Certification -2 per cycle 1 Cloud and 1 Management') {
            if (questionIndex === 0) {
                initialRating = 0;
                initialQuantityTarget = 0;
                initialQuantityAchieved = 0;
                initialIndexRating = 0;
            } else if (questionIndex === 1) {
                initialRating = 0;
                initialQuantityTarget = 0;
                initialQuantityAchieved = 0;
                initialIndexRating = 0;
            } // Add similar conditions for other questions within this category
            else if (questionIndex === 2) {
                initialRating = 0;
                initialQuantityTarget = 0;
                initialQuantityAchieved = 0;
                initialIndexRating = 0;
            }
        } // Add similar conditions for other categories
        else if (category.name === 'Reusable assets creation by self or team-1 per month') {
            if (questionIndex === 0) {
                initialRating = 0;
                initialQuantityTarget = 3;
                initialQuantityAchieved = 0;
                initialIndexRating = 0;
            } else if (questionIndex === 1) {
                initialRating = 0;
                initialQuantityTarget = 0;
                initialQuantityAchieved = 0;
                initialIndexRating = 0;
            } // Add similar conditions for other questions within this category
        } // Add similar conditions for other categories
        else if (category.name === 'Webinar 1 per 1 quater') {
            if (questionIndex === 0) {
                initialRating = 0;
                initialQuantityTarget = 0;
                initialQuantityAchieved = 0;
                initialIndexRating = 0;
            } else if (questionIndex === 1) {
                initialRating = 0;
                initialQuantityTarget = 0;
                initialQuantityAchieved = 0;
                initialIndexRating = 0;
            } // Add similar conditions for other questions within this category
        } // Add similar conditions for other categories
        else if (category.name === 'Case study 8 per year') {
            if (questionIndex === 0) {
                initialRating = 0;
                initialQuantityTarget = 2;
                initialQuantityAchieved = 0;
                initialIndexRating = 0;
            } else if (questionIndex === 1) {
                initialRating = 0;
                initialQuantityTarget = 0;
                initialQuantityAchieved = 0;
                initialIndexRating = 0;
            } // Add similar conditions for other questions within this category
        } // Add similar conditions for other categories

        return {
            id: questionIndex + 1,
            question: question,
            rating: initialRating,
            quantityTarget: initialQuantityTarget,
            quantityAchieved: initialQuantityAchieved,
            comment: '',
            indexrating: initialIndexRating,
            name: category.name, // Make sure you're setting the name correctly
        };
    }),
    isOpen: false,
}));


function Question({ question, onRatingChange, onQuantityTargetChange, onCommentChange, onIndexRatingChange }) {
    const handleRatingChange = (event) => {
        onRatingChange(question.id, parseInt(event.target.value, 10));
    };

    const handleCommentChange = (event) => {
        onCommentChange(question.id, event.target.value);
    };
    const handleIndexRatingChange = (event) => {
        onIndexRatingChange(question.id, parseInt(event.target.value, 10));

    };
    

    return (
        <tr>
            <td>{question.question}</td>
            <td>
                <span className="quantity-display">{question.quantityTarget}</span>
            </td>
            
            <td>
                <select
                    className="rating-dropdown"
                    value={question.rating}
                    onChange={handleRatingChange}
                >
                    <option value={0}>Select</option>
                    <option value={1}>1 (Poor)</option>
                    <option value={2}>2 (Average)</option>
                    <option value={3}>3 (Good)</option>
                    <option value={4}>4 (Excellent)</option>
                </select>
            </td>
            
            <td>
                <textarea
                    className="comment-input"
                    value={question.comment}
                    onChange={handleCommentChange}
                    placeholder="Add comments..."
                />
            </td>
            <td>
                <select
                    className="rating-dropdown"
                    value={question.indexrating}
                    onChange={handleIndexRatingChange}
                >
                    <option value={0}>Select</option>
                    <option value={1}>1 (Poor)</option>
                    <option value={2}>2 (Average)</option>
                    <option value={3}>3 (Good)</option>
                    <option value={4}>4 (Excellent)</option>
                </select>
            </td>
        </tr>
    );
}


const postDataToApi = (questions) => {
    // Prepare data for API request
    const dataToPost = questions.map((category) => ({
        name: category.category, // Use category.category here
        questions: category.questions.map((question) => ({
            Metric: question.question,
            QuantityTarget: question.quantityTarget,
            QuantityAchieved: question.rating,
            IndexKpi: question.indexrating,
            Comments: question.comment,
        })),
    }));

    // console.log('Data to post:', dataToPost);

    // Make POST request to API
    axios.post('http://172.17.15.249:4000/ValueCreaterKPIPost', dataToPost)
        .then(response => {
            console.log('Data posted successfully:', response);
            // Handle success logic if needed
        })
        .catch(error => {
            console.error('Error posting data:', error);
            // Handle error logic if needed
        });
};




function App() {
    const [questions, setQuestions] = useState(initialQuestions);
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(0); // Added state variable for active category


    const handleRatingChange = (questionId, rating) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((category) =>
                category.id === activeCategoryIndex + 1
                    ? {
                        ...category,
                        questions: category.questions.map((question) =>
                            question.id === questionId ? { ...question, rating } : question
                        ),
                    }
                    : category
            )
        );

        // Update the isPostDataButtonEnabled state variable based on all fields being filled
        setIsPostDataButtonEnabled(areAllFieldsFilled());
    };
    

    const handleIndexRatingChange = (questionId, indexrating) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((category) =>
                category.id === activeCategoryIndex + 1
                    ? {
                        ...category,
                        questions: category.questions.map((question) =>
                            question.id === questionId ? { ...question, indexrating } : question
                        ),
                    }
                    : category
            )
        );
    };

    const handleQuantityTargetChange = (questionId, quantityTarget) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((category) =>
                category.id === activeCategoryIndex + 1
                    ? {
                        ...category,
                        questions: category.questions.map((question) =>
                            question.id === questionId ? { ...question, quantityTarget } : question
                        ),
                    }
                    : category
            )
        );
    };

    const handleCommentChange = (questionId, comment) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((category) =>
                category.id === activeCategoryIndex + 1
                    ? {
                        ...category,
                        questions: category.questions.map((question) =>
                            question.id === questionId ? { ...question, comment } : question
                        ),
                    }
                    : category
            )
        );
    };


    

    const handleQuantityAchievedChange = (questionId, quantityAchieved) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((category) =>
                category.id === activeCategoryIndex + 1
                    ? {
                        ...category,
                        questions: category.questions.map((question) =>
                            question.id === questionId ? { ...question, quantityAchieved } : question
                        ),
                    }
                    : category
            )
        );
    };
    

    


    const toggleCategory = (categoryId) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((category) =>
                category.category === categoryId
                    ? { ...category, isOpen: !category.isOpen }
                    : { ...category, isOpen: false }
            )
        );
    };
    const areAllFieldsFilled = () => {
        for (const category of questions) {
            for (const question of category.questions) {
                // console.log(
                //     `Checking question in ${category.category}:`,
                //     question.question,
                //     'Quantity Target:', question.quantityTarget
                // );
    
                if (question.quantityTarget === 0) {
                    // console.log('Zero quantity target for question:', question);
                    // Return true here to enable the button even if the quantity target is zero
                    return true;
                }
            }
        }
        return true; // All fields are filled
    };
    
    
    
    

    const handlePostDataClick = () => {
        console.log("Post Data button clicked");
        postDataToApi(questions);
    };
    

    const handlePreviousClick = () => {
        if (activeCategoryIndex > 0) {
            setActiveCategoryIndex(activeCategoryIndex - 1);
        }
    };


    useEffect(() => {
        // console.log("isPostDataButtonEnabled inside useEffect:", isPostDataButtonEnabled);
    }, )


    const [isPostDataButtonEnabled, setIsPostDataButtonEnabled] = useState(false);
    const handleNextClick = () => {
        if (activeCategoryIndex < ValueCreator.length - 1) {
            setActiveCategoryIndex(activeCategoryIndex + 1);
        } else {
            console.log("Next button clicked for the last category.");
            const allFieldsFilled = areAllFieldsFilled();
    
            // Update the isPostDataButtonEnabled state variable based on all fields being filled
            setIsPostDataButtonEnabled(allFieldsFilled);
            // console.log("isPostDataButtonEnabled:", isPostDataButtonEnabled);
    
            if (allFieldsFilled) {
                console.log("All fields are filled. Enabling 'Post Data' button.");
            } else {
                console.log("Not all fields are filled. Disabling 'Post Data' button.");
            }
        }
    };
    

    console.log("activeCategoryIndex:", activeCategoryIndex);
    console.log("areAllFieldsFilled:", areAllFieldsFilled());
    const activeCategory = ValueCreator[activeCategoryIndex];

    return (
        <div className="App">
            <div className="category-names">
                {ValueCreator.map((category, index) => (
                    <div
                        key={index}
                        className={`category-name ${activeCategoryIndex === index ? 'open' : ''
                            }`}
                        onClick={() => setActiveCategoryIndex(index)}
                    >
                        {category.name}
                    </div>
                ))}
            </div>
            <table className="question-table">
                <thead>
                    <tr>
                        <th colSpan="5">Category Names</th>
                    </tr>
                    <tr>
                        <th>Metric</th>
                        <th>Quantity Target</th>
                        <th>Quantity Achieved</th>
                        <th>Comments</th>
                        <th>Index KPI</th>
                        {/* <th>D-Ratings</th>
                        <th>Prasad K Comments</th> */}

                    </tr>
                </thead>
                <tbody>
                    {questions
                        .filter((category) => category.category === activeCategory.name)
                        .map((category) =>
                            category.questions.map((question) => (
                                <Question
                                key={question.id}
                                question={question}
                                onRatingChange={handleRatingChange}
                                onQuantityTargetChange={handleQuantityTargetChange}
                                onQuantityAchievedChange={handleQuantityAchievedChange} 
                                onCommentChange={handleCommentChange}
                                onIndexRatingChange={handleIndexRatingChange}
                            />
                            
                            ))
                        )}
                </tbody>
            </table>
            <div className="navigation-buttons">
                <button onClick={handlePreviousClick} disabled={activeCategoryIndex === 0}>
                    Previous
                </button>
                <button
    onClick={handleNextClick}
    disabled={activeCategoryIndex === ValueCreator.length - 1}
>
    Next
</button>
{activeCategoryIndex === ValueCreator.length - 1 && (
                <button onClick={handlePostDataClick} disabled={!isPostDataButtonEnabled}>
                    Post Data
                </button>
            )}





            </div>
        </div>
      
    );
}

export default App;