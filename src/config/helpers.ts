export const get_current_monday = () => {
    const today = new Date();
    const cur_weekday = today.getDay() - 1;
    let monday
    if (today.getDay() > 0) {
        monday = new Date().setDate(today.getDate() - cur_weekday)
    } else {
        monday = new Date().setDate(today.getDate() - 6)
    }
    const monday_date = new Date(monday)
    monday_date.setHours(0,0,0,0)
    return monday_date
}
