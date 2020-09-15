const express = require('express');
const router = express.Router();

const { User, Event } = require('../models/user.model');

function adminCheck(req, res, next) {
    if (req.session.admin) {
        next();
    } else {
        res.redirect("/auth/adminLogin");
    }
}

router.use(adminCheck);

router.get('/populate', async (req, res) => {
    let { gravitasID, name } = req.query;

    if (!gravitasID || !name) {
        res.send('?gravitasID=____&?name=___');
        return;
    }

    gravitasID = gravitasID.toString();
    name = name.toString();

    let event = await Event.findOne({ name, gravitasID });

    if (!event) {
        event = new Event({
            name,
            gravitasID,
        });
        await event.save();
    }

    res.send(`Successfully added ${gravitasID}: ${name}`);
})

router.get('/', async (req, res) => {
    const filter = req.query;
    if (filter.event === "any") {
        delete filter.event;
    }

    if (filter.payment_status === "any") {
        delete filter.payment_status;
    }

    const result = await User.aggregate([
        {
            $lookup: {
                from: "events",
                localField: "event",
                foreignField: "gravitasID",
                as: "eventInfo"
            }
        },
        {
            $project: {
                name: 1,
                email: 1,
                mobile: 1,
                payment_status: 1,
                type: 1,
                event: '$eventInfo.name'
            }
        },
        {
            $match: filter,
        },
        {
            $sort: { event: -1 },
        }
    ]);

    const events = (await Event.find({}, { _id: 0, name: 1 })).map((event) => event.name);

    res.render("admin/viewUsers", {
        list: result,
        count: result.length,
        events,
    });
});

module.exports = router;
