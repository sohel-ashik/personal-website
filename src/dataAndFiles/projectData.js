
import quizBGimage from '../images/projects/quiz_app_bg.jpg';
import groceryBg from '../images/projects/grocery.jpg';
import fakeNews from '../images/projects/fake_news_bg.jpg';
import parentalBg from '../images/projects/parental_control.jpg';
import studentBg from '../images/projects/student_reg.jpg'

const webProjectData = [
    {
        title: "Quiz web app",
        image: quizBGimage,
        source: 'https://sohelashik-quizapp.netlify.app/'
    }
]

const appProjectData = [
    {
        title: "Grocery Management System",
        image: groceryBg,
        source: "https://drive.google.com/drive/folders/1LmGWY6h99Il6SOCO6D81U9ApHxhBUelq?usp=share_link"
    },
    {
        title: "Student registration logger",
        image: studentBg,
        source: "https://drive.google.com/drive/folders/1oRaUXp3LOvhQnZUpsqESM6BXTePSL2in?usp=share_link"
    },
    {
        title: "Parental control system",
        image: parentalBg,
        source: "https://drive.google.com/drive/folders/1bM9EiuCHSILi7xFtnKE_3rxH0eyFhmEc?usp=share_link"
    },
]

const researchProjectData = [
    {
        title: "Fake news detection with BiLSTM",
        image: fakeNews,
        source: "https://www.researchgate.net/publication/354035324_M82B_at_CheckThat_2021_Multiclass_fake_news_detection_using_BiLSTM"
    },
]

const allProjectData = [...webProjectData,...appProjectData,...researchProjectData];

export {webProjectData,appProjectData,researchProjectData,allProjectData}