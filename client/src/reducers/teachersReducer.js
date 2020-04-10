import axios from "axios";
import { createPayPeriodData } from "../helperFunctions";
import uuid from "uuid/v4";

const updateTeacher = async (state, teacher) => {
  await axios
    .put(`/api/teachers/update/${teacher._id}`, teacher)
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
  return state.map((t) =>
    t.id === teacher.id
      ? {
          ...t,
          resourceTitle: teacher.resourceTitle,
          name: teacher.name,
          familyName: teacher.familyName,
          teachingMins: teacher.teachingMins,
          holidayMins: teacher.holidayMins,
          outsideDutyMins: teacher.outsideDutyMins,
          otThreshold: teacher.otThreshold,
          overThresholdOneMins: teacher.overThresholdOneMins,
          overThresholdTwoMins: teacher.overThresholdTwoMins,
        }
      : t
  );
};

const teachersReducer = async (state, action) => {
  switch (action.type) {
    case "GET_TEACHERS":
      let teachersArr;
      await axios
        .get("/api/teachers")
        .then((res) => {
          teachersArr = res.data;
        })
        .catch((err) => console.log(err));
      return [...state, ...teachersArr];

    case "ADD_TEACHER":
      const teacher = action.teacher && action.teacher;
      await axios
        .post("/api/teachers/add", teacher)
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
      return [...state, { id: uuid(), teacher }];

    case "DELETE_TEACHER":
      await axios
        .delete(`/api/teachers/delete/${teacher._id}`)
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
      return state.filter((t) => t.id !== action.id);

    case "UPDATE_TEACHER":
      return updateTeacher(state, teacher);

    default:
      return state;
  }
};
export default teachersReducer;
