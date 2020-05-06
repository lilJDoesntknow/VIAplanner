import Vue from 'vue'
import Vuex from 'vuex'
import { generateTimetables } from "../timetable-planner"


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedCourses: {},
    timetables: [{
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],

    }],
    timetable: {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
    },
    colors: ["#FBB347", "#83CC77", "#4C91F9", "#F26B83", "#5CD1EB"],
    takenColors: [],
    lockedSections: []
  },
  mutations: {
    setTimetable(state, payload) {
      state.timetable = payload.timetable
     },
    setTimetables(state, payload) {
      state.timetables = payload.timetables
    },
    addCourse(state, payload) {
      state.selectedCourses[payload.course.courseCode] = payload.course
      state.takenColors.push(payload.course.color)
    },
    removeCourse(state, payload) {
      state.colors.push(state.selectedCourses[payload.code].color)
      state.takenColors.splice(state.takenColors.indexOf(state.selectedCourses[payload.code].color), 1);
      Vue.delete(state.selectedCourses, payload.code)
    },
    lockSection(state, payload) {
      state.lockedSections.push(payload)
    },
    unlockSection(state, payload) {
      state.lockedSections.splice(state.lockedSections.indexOf(payload), 1)
    }
  },
  actions: {
    selectCourse(context, payload) {
      const color = context.state.colors.pop()
      context.commit("addCourse", {
        course: {
          color,
          ...payload.course
        }
      })
      const courses = Object.keys(context.state.selectedCourses).map(code => context.state.selectedCourses[code])
      const timetables = generateTimetables(courses)
      console.log(timetables.length)
      context.commit("setTimetables", { timetables })
      context.commit("setTimetable", { timetable: context.state.timetables[0] })
    },
    deleteCourse(context, payload) {
      context.commit("removeCourse", payload)
      const courses = Object.keys(context.state.selectedCourses).map(code => context.state.selectedCourses[code])
      if (courses.length == 0) {
        context.commit("setTimetables", {
          timetables: [{
            MONDAY: [],
            TUESDAY: [],
            WEDNESDAY: [],
            THURSDAY: [],
            FRIDAY: [],
          }]
        }
        )
      }
      else {
        const timetables = generateTimetables(courses)
        context.commit("setTimetables", { timetables })
      }

      context.commit("setTimetable", { timetable: context.state.timetables[0] })
    }
  },
  modules: {
  },
  getters: {
    selectedCourses: state => {
      return state.selectedCourses
    },
    timetable: state => {
      return state.timetable
    },
    getCourseColor: (state) => (code) => {
      return state.selectedCourses[code].color
    },
    timetableSelectedMeetingSections: (state) => {
      return state.timetableSelectedMeetingSections
    }
  }
})
