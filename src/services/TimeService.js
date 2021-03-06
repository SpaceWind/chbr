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
            item.startHour =current.start;
            item.end = moment().startOf('day').seconds(current.finish).format('HH:mm');
            item.endHour =current.finish;
            item.startSeconds = current.start;
            item.endSeconds = current.finish;

        }

        let currentHour = moment().hour() * 60*60 +moment().minutes()*60+moment().seconds();
        let currentIndex = moment().day();
        let currentDay = this.days.find((day) => day.day === currentIndex);

        let prevIndex = currentIndex === 0 ? 6 : currentIndex - 1;
        let prevDay = this.days.find((day) => day.day === prevIndex);

        if (currentHour < currentDay.startHour && currentHour < prevDay.endHour && prevDay.endHour < prevDay.startHour) {
            currentDay = prevDay;
            currentDay.isOpen = true;
        } else
        {
            currentDay.isOpen = !(currentHour < currentDay.startHour || (currentHour > currentDay.endHour && currentDay.endHour > currentDay.startHour));
        }


        currentDay.isCurrent = true;

        let minutesForOpen = 181;
        let minutesForClose = 121;

        if (currentDay.isOpen) {
            let dateEnd = null;
            if (currentDay.endSeconds < currentDay.startSeconds && !(currentHour < currentDay.startHour && currentHour < prevDay.endHour && prevDay.endHour < prevDay.startHour)) {
                dateEnd = moment().endOf('days').seconds(currentDay.endSeconds);
            }
            else {
                dateEnd = moment().startOf('days').seconds(currentDay.endSeconds);
            }

            let toClose = dateEnd.diff(moment(), 'minutes');

            if (toClose <= minutesForClose) {
                currentDay.status = "Закрывается " + dateEnd.fromNow();
            }
            else {
                currentDay.status = "Сегодня открыто";
            }
        }
        else {
            let dateStart = moment().startOf('days').seconds(currentDay.startSeconds);
            if (dateStart < moment()) {
                let day = this.days.find((day) => day.day === moment().add(1, "days").day());
                dateStart = moment().add(1, "days").startOf('days').seconds(day.startSeconds);
            }
            let toOpen = dateStart.diff(moment(), 'minutes');
            if (toOpen <= minutesForOpen) {
                currentDay.status = "Открывается " + dateStart.fromNow();
            }
            else {
                currentDay.status = "Закрыто"
            }
        }

        return this.days;
    }


}