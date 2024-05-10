const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

app.listen(3000, () => {
  console.log('server started');
});

// @ts-nocheck
const Discord = require("discord.js")
const dbClass = require("pro.db-arzex")
let db = new dbClass("points.json")
const client = new Discord.Client({intents : 3276799})
var moment = require('moment-timezone');
var pr = require("pretty-ms")
client.on('ready', () => {
console.log(`Logged in as ${client.user.tag} Online`);
client.user.setActivity('=help', { type: 'PLAYING' })
client.user.setStatus("idle");
});
const ownerId = "937674152092008488" //ايدي اونر البوت
let id2 = "1167318151051083796" //ايدي الرتبة اللي يمديها تسجل دخول وخروج
let lllog= "1227773829263261706" //ايدي روم لوق
let prole = "1167617264858697738" //ايدي رتبة تزيد نقاط
client.on("messageCreate", async message=>{
    if(message.content == "#send"){
        if(message.author.id != ownerId) return
        let row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("login")
            .setLabel("تسجيل الدخول")
            .setStyle(Discord.ButtonStyle.Success)
            .setEmoji("<a:emoji_8:1138994052348522526>"),
            new Discord.ButtonBuilder()
            .setCustomId("logout")
            .setLabel("تسجيل الخروج")
            .setStyle(Discord.ButtonStyle.Danger)
            .setEmoji("<a:Shadow103:1139603492034588672>")
        )
        let embed = new Discord.EmbedBuilder()
        .setColor("DarkBlue")
        .setTitle("تسجيل دخول/خروج")
        .setDescription("تستطيع تسجيل الدخول او الخروج من الازرار في الاسفل")
        .setFooter({text : "وزارة الداخلـيـة",iconURL:message.guild?.iconURL()})
        message.channel.send({components :[row],embeds:[embed]})
    }
})



// @ts-ignore

client.on("interactionCreate", async interacion=>{
    if(!interacion.isButton()) return
    if(!interacion.inGuild()) return
    if(!interacion.member.roles.cache.has(id2)) return
    if(interacion.customId == "login"){
        if(db.has(interacion.user.id)) return interacion.reply({content : `:x: | انت مسجل دخول بالفعل`,ephemeral:true})
        db.set(interacion.user.id,Date.now())
        db.add(`points-${interacion.user.id}`,1)
        interacion.reply({content:" <:emoji_29:1139600268821008385>  - عزيزي العسكري                                                                                           <a:emoji_8:1138994052348522526>  - تم تسجيل دخـولك بنجاح",ephemeral:true})
        let ch = await client.channels.fetch(lllog)
        if(!ch) return
        ch.send({content : `
لقد قام العـسـكري : ${interacion.user}
بتسجيل الدخول الان`})
    }
    if(interacion.customId == "logout"){
        if(!db.has(interacion.user.id)) return interacion.reply({content : `:x: | انت لست مسجل دخول `,ephemeral:true})
        let ch = await client.channels.fetch(lllog)
        if(!ch) return
        ch.send({content : `
لقد قام العـسكري : ${interacion.user}
بتسجيل الخروج 
عند الساعة : ${moment.tz("Asia/Riyadh").hour()} :${moment.tz("Asia/Riyadh").minute()}
بتسجيل الخروج الان
مدة التسجيل : ${pr(Date.now() - db.get(interacion.user.id)).replace("ms","مللي ثانية").replace("m","دقيقة").replace("s","ثانية").replace("h","ساعة")}`})
        db.delete(interacion.user.id)
        interacion.reply({content:" <:emoji_29:1139600268821008385>  - عزيزي العسكري                                                                                           <a:emoji_8:1138994052348522526>  - تم تسجيل خـروجـك بنجاح",ephemeral:true})
    }
})

client.on("messageCreate",async message=>{
    if(message.content.startsWith("#نقاطي")){
        let member = message.mentions.members?.first() || message.member
        let points = db.has(`points-${member?.id}`) ? db.get(`points-${member?.id}`) : 0
        message.reply({content : `<:emoji_29:1139600268821008385>  - عزيزي العسكري  :  ${member}          
                                                                              <a:emoji_8:1138994052348522526>  - نقاطك العسكرية : ${points}`})
    }
    if(message.content.startsWith("#اضافة")){
        if(!message.member?.roles.cache.has(prole)) return
        let args = message.content.split(" ")
        if(!args[2]) return message.reply("#اضافة @منشن المبلغ")
        let member = message.mentions.members.first()
        if(!member) return message.reply("#اضافة @منشن المبلغ")
        db.add(`points-${member?.id}`,parseInt(args[2]))
        message.reply({content : "<a:emoji_8:1138994052348522526>: | تمت اضافة النقاط للعسكري بنجاح"})
    }
})

process.on('unhandledRejection', (reason, p) => {
  console.log(reason)
});

process.on('uncaughtException', (err, origin) => {
  console.log(err)
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log(err)
});
client.login(process.env.token)