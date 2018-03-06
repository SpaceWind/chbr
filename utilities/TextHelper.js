export default class TextHelper {


    static titles = ['балл', 'балла', 'баллов'];

    static getBonusText(bonus) {
        let cases = [2, 0, 1, 1, 1, 2];
        return this.titles[(bonus % 100 > 4 && bonus % 100 < 20) ? 2 : cases[(bonus % 10 < 5) ? bonus % 10 : 5]];
    }

    static getBonus(amount) {
        return Math.floor(amount * 0.02);
    }

}