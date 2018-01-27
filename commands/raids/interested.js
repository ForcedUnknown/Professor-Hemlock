"use strict";

const log = require('loglevel').getLogger('InterestedCommand'),
	Commando = require('discord.js-commando'),
	{CommandGroup, RaidStatus} = require('../../app/constants'),
	Helper = require('../../app/helper'),
	Raid = require('../../app/raid'),
	NaturalArgumentType = require('../../types/natural');

class InterestedCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'maybe',
			group: CommandGroup.BASIC_RAID,
			memberName: 'maybe',
			aliases: ['interested', 'interest', 'hmm'],
			description: 'Expresses interest in an existing raid without committing to it.',
			details: 'Use this command to express interest in a raid.',
			examples: ['\t!maybe', '\t!interested', '\t!hmm'],
			args: [
				{
					key: 'additional_attendees',
					label: 'additional attendees',
					prompt: 'How many additional people would come with you?\nExample: `+1`\n\n*or*\n\nHow many people would come (including yourself)?\nExample: `2`\n',
					type: 'natural',
					default: NaturalArgumentType.UNDEFINED_NUMBER
				}
			],
			argsPromptLimit: 3,
			guildOnly: true
		});

		client.dispatcher.addInhibitor(message => {
			if (!!message.command && message.command.name === 'maybe' &&
				!Raid.validRaid(message.channel.id)) {
				return ['invalid-channel', message.reply('Express interest in a raid from its raid channel!')];
			}
			return false;
		});
	}

	async run(message, args) {
		const additional_attendees = args['additional_attendees'],
			info = Raid.setMemberStatus(message.channel.id, message.member.id, RaidStatus.INTERESTED, additional_attendees);

		if (!info.error) {
			message.react(Helper.getEmoji('snorlaxthumbsup') || '👍')
				.catch(err => log.error(err));

			Raid.refreshStatusMessages(info.raid);
		} else {
			message.reply(info.error)
				.catch(err => log.error(err));
		}
	}
}

module.exports = InterestedCommand;
