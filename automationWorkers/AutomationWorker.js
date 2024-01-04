
import { until, By } from 'selenium-webdriver';
import ofMembers from '../models/ofMembers.js'

class AutomationWorker {

  static async scrapAllMembers(driver, creatorId) {
    await driver.get('https://onlyfans.com/my/collections/user-lists/subscribers/active'); // subscribers subscribers/active
    await driver.wait(until.elementLocated(By.className('b-users__item__inner')));

    const usersDone = {};

    let stopScrolling = false;
    let prevousLastUser = undefined;

    let userId;
    while (!stopScrolling) {
      const users = await driver.findElements(By.className('b-users__item__inner'));
      console.log(new Date(), 'iteration')
      console.log('bd', await ofMembers.count())
      console.log('users', users.length, userId)

      for (const user of users) {

        // try {
        //   await driver.actions()
        //     .scroll(0, 0, 0, 0, user)
        //     .perform()
        // } catch (e) {
        //   console.log('Scroll error 1')
        // }

        // try {
        //   await driver.executeScript("arguments[0].scrollIntoView(true);", user);
        // } catch (e) {
        //   console.log('Scroll error 1.1')
        // }

        try {
          userId = await user.findElement(By.className('g-user-username')).getText();

          if (!userId) {
            // console.log('User with no id')
            continue
          }

          if (usersDone[userId]) {
            // console.log('User already done')
            continue
          }

          let earningsElements = await user.findElements(By.className('b-fans__item__list__item'));

          if (!earningsElements.length || earningsElements.length < 6) {
            const buttons = await user.findElements(By.className(`b-tabs__nav__link`)); // EARNINGS click
            const button = buttons[1];

            if (!await button.getText()) {
              console.log('No button')
            } else {
              console.log('Button found', await button.getText())
              await button.click()
            }
          }

          await driver.wait(until.elementLocated(By.className('b-fans__item__list__item')));
          earningsElements = await user.findElements(By.className('b-fans__item__list__item'));
          const totalEarningsText = await earningsElements[earningsElements.length - 1].getText();
          const totalEarnings = Number(totalEarningsText.replace(/[^0-9.-]+/g,""));

          usersDone[userId] = true;
          console.log(new Date(), 'member load', userId, totalEarnings)
          if (userId) {
            await ofMembers.upsert(userId, creatorId, totalEarnings);
          }
        } catch (e) {
          driver.executeScript("window.scrollBy(0,-125)");
          console.error(e);
          // return
        }
      }

      // if (lastUser === prevousLastUser) {
      //   stopScrolling = true;
      // }

      // const lastUsers = await driver.findElements(By.className('b-users__item__inner'));
      // const lastUser = lastUsers[lastUsers.length - 1];

      // await driver.actions()
      //   .scroll(0, 0, 0, 0, lastUser)
      //   .perform()

      await driver.executeScript("window.scrollBy(0,100)");

    }
  }


  static async scrapLastSubscribtions(driver) {

    await driver.get('https://onlyfans.com/my/notifications/subscribed');
    await driver.wait(until.elementLocated(By.className('vue-recycle-scroller__item-view')));

    let stopScrolling = false;
    let prevousLastUserId = undefined;
    while (!stopScrolling) {
      const users = await driver.findElements(By.className('b-notifications__list__item'));
      let lastUserId = 0;
      console.log('Users count', users.length);

      for (const user of users) {
        let userId;
        try {
          userId = await user.findElement(By.className('g-user-username')).getText();
        } catch (e) {
          console.log('User with no id')
          continue
        }
        lastUserId = userId;
        const subDate = await user.findElement(By.className('b-notifications__list__item__actions__item')).getText();
        if (!(subDate.includes('Yesterday') || subDate.includes(' ago'))) {
          console.log('Old user')
          stopScrolling = true;
          break;
        }
        console.log('User', userId, subDate);
      }

      if (lastUserId === prevousLastUserId) {
        stopScrolling = true;
      }

      prevousLastUserId = lastUserId;
      const lastUser = users[users.length - 1];
  
      await driver.actions()
        .scroll(0, 0, 0, 0, lastUser)
        .perform()

    }

  }

}

export default AutomationWorker
