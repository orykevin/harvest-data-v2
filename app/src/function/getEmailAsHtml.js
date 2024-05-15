this.getEmailAsHtml = (options,date) => {
    return new Promise((resolve, reject) => {
        this.parseEml(options)
            .then(result => {
                const iso = result.date.toISOString()
                const losAngelesTime = moment.tz(iso, 'America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss a');
                let headerHtml = `
                <div style="border: 1px solid #e5e5e5;margin-bottom: 5px;padding: 10px 20px 20px 20px;border-radius: 10px;">
                    <h2>${result.subject}</h2>
                    <div style="display:flex;width:100%;">
                        <span style="font-weight:600;">From:&nbsp;${result.from.html}</span>
                        <span style="flex: 1 1 auto;"></span>
                    </div>
                `
                if (result.to) {
                    headerHtml = headerHtml + `<div style="font-size:16px;">To:&nbsp;${result.to.html}</div>`
                }
                if (result.cc) {
                    headerHtml = headerHtml + `<div style="font-size:16px;">Cc:&nbsp;${result.cc.html}</div><span style="color:black;font-weight:400">${losAngelesTime} </span></div>`
                } else {
                    headerHtml = headerHtml + `<span style="color:black;font-weight:600">${losAngelesTime}</span></div>`
                }

                this.getEmailBodyHtml()
                    .then(bodyHtml => {
                        resolve(headerHtml + `<p>${bodyHtml}</p>`)
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
            .catch(err => {
                reject(err);
            })

    })
}
// old //


this.getEmailAsHtml = (options,date) => {
    return new Promise((resolve, reject) => {
        this.parseEml(options)
            .then(result => {
                const iso = result.date.toISOString()
                const losAngelesTime = moment.tz(iso, 'America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss a');
                let headerHtml = `
                <div style="border: 1px solid #e5e5e5;margin-bottom: 5px;padding: 10px 20px 20px 20px;border-radius: 10px;">
                    <h2>${result.subject}</h2>
                    <div style="display:flex;width:100%;">
                        <span style="font-weight:600;">From:&nbsp;${result.from.html}</span>
                        <span style="flex: 1 1 auto;"></span>
                    </div>
                `
                let textHtml = result.textAsHtml
                if (result.to) {
                    headerHtml = headerHtml + `<div style="font-size:16px;">To:&nbsp;${result.to.html}</div>`
                }
                if (result.cc) {
                    headerHtml = headerHtml + `<div style="font-size:16px;">Cc:&nbsp;${result.cc.html}</div><span style="color:black;font-weight:400">${losAngelesTime} </span></div>`
                } else {
                    headerHtml = headerHtml + `<span style="color:black;font-weight:600">${losAngelesTime}</span></div>`
                }

                this.getEmailBodyHtml()
                    .then(bodyHtml => {
                        if(bodyHtml == ""){
                            resolve(headerHtml + `<p>${textHtml}</p>`)
                        }else{
                            resolve(headerHtml + `<p>${bodyHtml}</p>`)
                        }
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
            .catch(err => {
                reject(err);
            })

    })
}

this.getEmailHeaders = () => {
    let defaultUser = [{
        name: "-",
        address: "-"
    }]
    return new Promise((resolve, reject) => {
        this.parseEml()
            .then(result => {
                let headers = {
                    subject: result.subject ? result.subject : "-",
                    from: (result.from && result.from.value !== null) ? result.from.value : defaultUser ,
                    to: (result.to && result.to.value !== null) ? result.to.value : defaultUser ,
                    cc: result.cc ? result.cc.value : null,
                    date: result.date ? result.date : new Date,
                    inReplyTo: result.inReplyTo ? result.inReplyTo : "-",
                    messageId: result.messageId ? result.messageId : "-",
                }
                resolve(headers)
            })
            .catch(err => {
                reject(err);
            })
    })
}