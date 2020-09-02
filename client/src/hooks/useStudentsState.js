import { useState, useContext } from 'react';
import axios from 'axios';
import { tokenConfig } from '../reducers/loadUserReducer';
import { UserContext } from '../context/UserContext';

export default (initialStudents) => {
  const { user } = useContext(UserContext);
  const [students, setStudents] = useState(initialStudents);

  const getStudents = async () => {
    await axios
      .get('/api/students', tokenConfig(user))
      .then((res) => setStudents(res.data))
      .catch((err) => console.log(err));
  };

  return {
    students,
    setStudents,
    getStudents: () => getStudents(),
    addStudent: async (newStudent) => {
      await axios
        .post('/api/students/add', newStudent, tokenConfig(user))
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
      return setStudents([...students, newStudent]);
    },
    async editStudent(student, editedStudent) {
      await axios
        .put(
          `/api/students/update/${student._id}`,
          editedStudent,
          tokenConfig(user),
        )
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
      getStudents();
    },
    deleteStudent: async (student) => {
      await axios
        .delete(`/api/students/delete/${student._id}`, tokenConfig(user))
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
      return setStudents(students.filter((t) => t._id !== student._id));
    },
  };
};
