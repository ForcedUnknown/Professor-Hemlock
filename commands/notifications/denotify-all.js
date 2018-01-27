"use strict";

const log = require('loglevel').getLogger('DenotifyCommand'),
	Commando = require('discord.js-commando'),
	{CommandGroup} = require('../../app/constants'),
	Helper = require('../../app/helper'),
	Notify = require('../../app/notify');

class DenotifyAllCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'unwant-all',
			group: CommandGroup.NOTIFICATIONS,
			memberName: 'unwant-all',
			aliases: ['denotify-all', 'want-none'],
			description: 'Removes all notifications for raid bosses.',
			details: 'Use this command to remove all notifications for raid bosses.',
			examples: ['\t!unwant-all'],
			guildOnly: true
		});

		client.dispatcher.addInhibitor(message => {
			if (!!message.command && message.command.name === 'unwant-all' && !Helper.isBotChannel(message)) {
				return ['invalid-channel', message.reply(Helper.getText('denotifyall.warning', message))];
			}
			return false;
		});
	}

	async run(message, args) {
		Notify.removeAllNotifications(message.member)
			.then(result => message.react(Helper.getEmoji('snorlaxthumbsup') || '👍'))
			.catch(err => log.error(err));
	}
}

module.exports = DenotifyAllCommand;
