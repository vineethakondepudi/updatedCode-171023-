import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import EmployeePortal from './EmployeePortal'
import ManagerPortal from './ManagerPortal'
import ReviewTable from './ReviewTable';
import HrPortal from './HrPortal'
import HrView from './HrView';
import Main from './Main';
import EmployeeView from './EmployeeView';
import EmployeegetData from './EmloyeegetData'
import HrReviewTable from './HrReviewTable';
import Practice from './Practice'
import Performance from './Performance';
import DataTable from './DataTable';
import Question from './Question'
import Pdquestion from './Pdquestion'
import Boquestion from './Boquestion'
import Dpquestions from './Dpquestions'
import Maquestions from './Maquestions'


import NavigationComponent from './NavigationComponent';
import TabComponent from './TabComponent'
import SubTabs from './SubTabs';
import Mform from './Mform';
import Eform from './Eform';
import Mview from './Mview';
import Eview from './Eview';

import Mget from './Mget';
import Medataview from './Medataview';
import Eget from './Eget';
import Mratings from './Mratings';
import ManagerCommentsPost from './ManagerCommentsPost';
import AdminloginForm from './AdminloginForm';
import AdminView from './AdminView';
import EmployeeKPIsComponent from './EmployeeKPIsComponent';
import ManagerKPIsComponent from './ManagerKPIsComponent';
import DirectorView from './DirectorView';
import DirectorPortal from './DirectorPortal';
import DirectorManagersView from './DirectorManagersView';
import DirectorManagerDetails from './DirectorManagerDetails';
import DirectorEmployeeDetails from './DirectorEmployeeDetails';
import DirectorMngEmpDetails from './DirectorMngEmpDetails';
import PasswordResetForm from './PasswordResetForm';
import ChangePasswordForm from './ChangePassword';
import Eupdate from './Eupdate';
import Mupdate from './Mupdate';
import ManagerViewEmployeeDetails from './ManagerViewEmployeeDetails';
import DirMagUpdateDetails  from './DirMagUpdateDetails';
import DirectorForm from './DirectorForm';
import DirectorFormDetails from './DirectorFormDetails';
import DirectorUpdateDetails from './DirectorUpdateDetails';
import VicePresidentView from './VicePresidentView';
import VicePresidentPortal from './VicePresidentPortal';
import VicePresidentComments from './VicePresidentComments';
import VpDirectorComments from './VpDirectorComments';
import DirectorKPIsComponent from './DirectorKPIsComponent';
import ResetPasswordDialog from './ResetPasswordDialog';


function App() {
  return (
    <div >
      <Router>
        <Routes>


          {/* Commmon Paths */}
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/resetpwd" element={<PasswordResetForm />} />
          <Route path='/resetPasswordDialog' element={<ResetPasswordDialog/>}/>


           {/* Admin paths */}
           <Route path="/adminLogin" element={<AdminloginForm />} />
           <Route path="/adminview" element={<AdminView />} /> 
           <Route path="/EmployeeKPIsComponent" element={<EmployeeKPIsComponent />} />
          <Route path="/ManagerKPIsComponent" element={<ManagerKPIsComponent />} />
          <Route path="/DirectorKPIsComponent" element={<DirectorKPIsComponent/>} />
           



          {/* Employee Paths */}
          <Route path="/eview" element={<Eview />} />
          <Route path="/eform" element={<Eform />} />
          <Route path="/eget/:empid" element={<Eget />} />
          <Route path="/eUpdate/:empid" element={<Eupdate />} />
       

          {/* Manager Paths */} 
          <Route path="/mview" element={<Mview />} />
          <Route path="/mform" element={<Mform />} />
          <Route path="/mget/:empId" element={<Mget />} />
          <Route path="/mUpdate/:empId" element={<Mupdate />} />
          <Route path="/meview" element={<Medataview />} />
          <Route path="/mcomments/:empId" element={<ManagerCommentsPost />} />
          <Route path="/mViewEmpDetails/:empId" element={<ManagerViewEmployeeDetails />} />



          {/* Director Paths */}
          <Route path="/directorview" element={<DirectorView />} />
          <Route path="/directorportal" element={<DirectorPortal />} />
          <Route path="/directormanagerdetails/:empId" element={<DirectorManagerDetails />} />
          <Route path="/directoremployeedetails" element={<DirectorEmployeeDetails />} />
          <Route path="/directormngempdetails/:empId" element={<DirectorMngEmpDetails />} />
          <Route path="/directorManagerUpdateDetails/:empId" element={<DirMagUpdateDetails/>} />
          <Route path="/directorForm" element={<DirectorForm/>} />
          <Route path="/directorFormDetails/:empId" element={<DirectorFormDetails/>} />
          <Route path="/directorUpdateDetails/:empId" element={<DirectorUpdateDetails/>} />


         {/* Vice President Paths */}
         <Route path="/VPPortal" element={<VicePresidentPortal />} />
         <Route path="/VPView" element={<VicePresidentView />} />
         <Route path="/VPComments/:empId" element={<VicePresidentComments />} />
         <Route path='/VpDComments/:empId' element={<VpDirectorComments/>} />
         

         
          <Route path="/employee" element={<EmployeePortal />} />
          <Route path="/manager" element={<ManagerPortal />} />
          <Route path="/review/:empid" element={<ReviewTable />} />
          <Route path="/hr/:empId" element={<HrPortal />} />
          <Route path="/hrview" element={<HrView />} />
          <Route path="/employeeview" element={<EmployeeView />} />
          <Route path="/empget" element={<EmployeegetData />} />
          <Route path="/hrreview/:empid" element={<HrReviewTable />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/datatable" element={<DataTable />} />
          <Route path="/question" element={<Question />} />
          <Route path="/pdquestion" element={<Pdquestion />} />
          <Route path="/boquestion" element={<Boquestion />} />
          <Route path="/dpquestion" element={<Dpquestions />} />
          <Route path="/maquestion" element={<Maquestions />} />
          <Route path="/navigation" element={<NavigationComponent />} />
          <Route path="/tab" element={<TabComponent />} />
          <Route path="/sub" element={<SubTabs />} />
          <Route path="/mrating" element={<Mratings />} />
          <Route path="/directormanagerview" element={<DirectorManagersView />} />
          
             {/* needs to adjust the sidebar and buttons */}

         <Route path="/changepwd" element={<ChangePasswordForm />} />
    
        </Routes>
      </Router>
    </div>
  );
}

export default App;
