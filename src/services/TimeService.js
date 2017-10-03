import moment from "moment";
export default class TimeService {


    days = [
        {
            id: "monday",
            day: 1,
            name: "Пн"

        },
        {
            id: "tuesday",
            day: 2,
            name: "Вт"
        },
        {
            id: "wednesday",
            day: 3,
            name: "Ср"
        },
        {
            id: "thursday",
            day: 4,
            name: "Чт"
        },
        {
            id: "friday",
            day: 5,
            name: "Пт"
        },
        {
            id: "saturday",
            day: 6,
            name: "Сб"
        },
        {
            id: "sunday",
            day: 0,
            name: "Вс"
        }
    ];

    getTimesheet(schedule) {
        for (let item of this.days) {
            let current = schedule[item.id];
            item.start = moment().startOf('day').seconds(current.start).format('HH:mm');
            item.startHour = moment().startOf('day').seconds(current.start).hour();
            item.end = moment().startOf('day').seconds(current.finish).format('HH:mm');
            item.endHour = moment().startOf('day').seconds(current.finish).hour();
        }

        let currentHour = moment().hour();
        let currentIndex = moment().day();
        let currentDay = this.days.find((day) => day.day === currentIndex);

        currentIndex = currentIndex === 0 ? 6 : currentIndex - 1;
        let prevDay = this.days.find((day) => day.day === currentIndex);

        if (currentHour < currentDay.startHour && currentHour <= prevDay.endHour && prevDay.endHour<prevDay.startHour) {
            currentDay = prevDay;
        }
        if (currentHour < currentDay.startHour || (currentHour > currentDay.endHour &&currentDay.endHour>currentDay.startHour)) {
            currentDay.isOpen = false;
        }
        else {
            currentDay.isOpen = true;
        }

        currentDay.isCurrent = true;

        if (currentDay.isOpen) {
            currentDay.secondsToEnd = moment().diff(currentDay.endHour, 'seconds');
        }


        return this.days;
    }
}