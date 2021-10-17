// const util = require('util');

const rules = {
    "stats": [
        {
            "id": 1,
            "entityTypeId": 1472902489,
            "key": "STR",
            "name": "Strength",
            "compendiumText": "<p>Strength measures bodily power, athletic training, and the extent to which you can exert raw physical force.</p>\r\n<h4 id=\"StrengthChecks\">Strength Checks</h4>\r\n<p>A Strength check can model any attempt to lift, push, pull, or break something, to force your body through a space, or to otherwise apply brute force to a situation. The Athletics skill reflects aptitude in certain kinds of Strength checks.</p>\r\n<h5 id=\"Athletics\">Athletics</h5>\r\n<p>Your Strength (Athletics) check covers difficult situations you encounter while climbing, jumping, or swimming. Examples include the following activities:</p>\r\n<ul>\r\n<li>You attempt to climb a sheer or slippery cliff, avoid hazards while scaling a wall, or cling to a surface while something is trying to knock you off.</li>\r\n<li>You try to jump an unusually long distance or pull off a stunt midjump.</li>\r\n<li>You struggle to swim or stay afloat in treacherous currents, storm-tossed waves, or areas of thick seaweed. Or another creature tries to push or pull you underwater or otherwise interfere with your swimming.</li>\r\n</ul>\r\n<h5 id=\"OtherStrengthChecks\">Other Strength Checks</h5>\r\n<p>The DM might also call for a Strength check when you try to accomplish tasks like the following:</p>\r\n<ul>\r\n<li>Force open a stuck, locked, or barred door</li>\r\n<li>Break free of bonds</li>\r\n<li>Push through a tunnel that is too small</li>\r\n<li>Hang on to a wagon while being dragged behind it</li>\r\n<li>Tip over a statue</li>\r\n<li>Keep a boulder from rolling</li>\r\n</ul>\r\n<h4 id=\"AttackRollsandDamage\">Attack Rolls and Damage</h4>\r\n<p>You add your Strength modifier to your attack roll and your damage roll when attacking with a melee weapon such as a mace, a battleaxe, or a javelin. You use melee weapons to make melee attacks in hand-to-hand combat, and some of them can be thrown to make a ranged attack.</p>\r\n<h4 id=\"LiftingandCarrying\">Lifting and Carrying</h4>\r\n<p>Your Strength score determines the amount of weight you can bear. The following terms define what you can lift or carry.</p>\r\n<p><strong>Carrying Capacity.</strong> Your carrying capacity is your Strength score multiplied by 15. This is the weight (in pounds) that you can carry, which is high enough that most characters don't usually have to worry about it.</p>\r\n<p><strong>Push, Drag, or Lift.</strong> You can push, drag, or lift a weight in pounds up to twice your carrying capacity (or 30 times your Strength score). While pushing or dragging weight in excess of your carrying capacity, your speed drops to 5 feet.</p>\r\n<p><strong>Size and Strength.</strong> Larger creatures can bear more weight, whereas Tiny creatures can carry less. For each size category above Medium, double the creature's carrying capacity and the amount it can push, drag, or lift. For a Tiny creature, halve these weights.</p>\r\n<h4 id=\"VariantEncumbrance\">Variant: Encumbrance</h4>\r\n<p>The rules for lifting and carrying are intentionally simple. Here is a variant if you are looking for more detailed rules for determining how a character is hindered by the weight of equipment. When you use this variant, ignore the Strength column of the Armor table in <a title=\"Armor and Shields\" href=\"https://www.dndbeyond.com/compendium/rules/phb/equipment#ArmorandShields\">chapter 5</a>.</p>\r\n<p>If you carry weight in excess of 5 times your Strength score, you are <strong>encumbered</strong>, which means your speed drops by 10 feet.</p>\r\n<p>If you carry weight in excess of 10 times your Strength score, up to your maximum carrying capacity, you are instead <strong>heavily encumbered</strong>, which means your speed drops by 20 feet and you have disadvantage on ability checks, attack rolls, and saving throws that use Strength, Dexterity, or Constitution.</p>"
        },
        {
            "id": 2,
            "entityTypeId": 1472902489,
            "key": "DEX",
            "name": "Dexterity",
            "compendiumText": "<p>Dexterity measures agility, reflexes, and balance.</p>\r\n<h4 id=\"DexterityChecks\">Dexterity Checks</h4>\r\n<p>A Dexterity check can model any attempt to move nimbly, quickly, or quietly, or to keep from falling on tricky footing. The Acrobatics, Sleight of Hand, and Stealth skills reflect aptitude in certain kinds of Dexterity checks.</p>\r\n<h5 id=\"Acrobatics\">Acrobatics</h5>\r\n<p>Your Dexterity (Acrobatics) check covers your attempt to stay on your feet in a tricky situation, such as when you're trying to run across a sheet of ice, balance on a tightrope, or stay upright on a rocking ship's deck. The DM might also call for a Dexterity (Acrobatics) check to see if you can perform acrobatic stunts, including dives, rolls, somersaults, and flips.</p>\r\n<h5 id=\"SleightofHand\">Sleight of Hand</h5>\r\n<p>Whenever you attempt an act of legerdemain or manual trickery, such as planting something on someone else or concealing an object on your person, make a Dexterity (Sleight of Hand) check. The DM might also call for a Dexterity (Sleight of Hand) check to determine whether you can lift a coin purse off another person or slip something out of another person's pocket.</p>\r\n<h5 id=\"Stealth\">Stealth</h5>\r\n<p>Make a Dexterity (Stealth) check when you attempt to conceal yourself from enemies, slink past guards, slip away without being noticed, or sneak up on someone without being seen or heard.</p>\r\n<h5 id=\"OtherDexterityChecks\">Other Dexterity Checks</h5>\r\n<p>The DM might call for a Dexterity check when you try to accomplish tasks like the following:</p>\r\n<ul>\r\n<li>Control a heavily laden cart on a steep descent</li>\r\n<li>Steer a chariot around a tight turn</li>\r\n<li>Pick a lock</li>\r\n<li>Disable a trap</li>\r\n<li>Securely tie up a prisoner</li>\r\n<li>Wriggle free of bonds</li>\r\n<li>Play a stringed instrument</li>\r\n<li>Craft a small or detailed object</li>\r\n</ul>\r\n<h4 id=\"AttackRollsandDamage\">Attack Rolls and Damage</h4>\r\n<p>You add your Dexterity modifier to your attack roll and your damage roll when attacking with a ranged weapon, such as a sling or a longbow. You can also add your Dexterity modifier to your attack roll and your damage roll when attacking with a melee weapon that has the finesse property, such as a dagger or a rapier.</p>\r\n<h4 id=\"ArmorClass\">Armor Class</h4>\r\n<p>Depending on the armor you wear, you might add some or all of your Dexterity modifier to your Armor Class, as described in chapter 5, \"<a title=\"Armor and Shields\" href=\"https://www.dndbeyond.com/compendium/rules/phb/equipment#ArmorandShields\">Equipment</a>.\"</p>\r\n<h4 id=\"Initiative\">Initiative</h4>\r\n<p>At the beginning of every combat, you roll initiative by making a Dexterity check. Initiative determines the order of creatures' turns in combat, as described in chapter 9, \"<a title=\"Initiative\" href=\"https://www.dndbeyond.com/compendium/rules/phb/combat#Initiative\">Combat</a>.\"</p>\r\n<blockquote>\r\n<p><strong>HIDING</strong></p>\r\n<p>The DM decides when circumstances are appropriate for hiding. When you try to hide, make a Dexterity (Stealth) check. Until you are discovered or you stop hiding, that check's total is contested by the Wisdom (Perception) check of any creature that actively searches for signs of your presence.</p>\r\n<p>You can't hide from a creature that can see you clearly, and you give away your position if you make noise, such as shouting a warning or knocking over a vase. An invisible creature can always try to hide. Signs of its passage might still be noticed, and it does have to stay quiet.</p>\r\n<p>In combat, most creatures stay alert for signs of danger all around, so if you come out of hiding and approach a creature, it usually sees you. However, under certain circumstances, the DM might allow you to stay hidden as you approach a creature that is distracted, allowing you to gain advantage on an attack roll before you are seen.</p>\r\n<p><strong>Passive Perception.</strong> When you hide, there's a chance someone will notice you even if they aren't searching. To determine whether such a creature notices you, the DM compares your Dexterity (Stealth) check with that creature's passive Wisdom (Perception) score, which equals 10 + the creature's Wisdom modifier, as well as any other bonuses or penalties. If the creature has advantage, add 5. For disadvantage, subtract 5.</p>\r\n<p>For example, if a 1st-level character (with a proficiency bonus of +2) has a Wisdom of 15 (a +2 modifier) and proficiency in Perception, he or she has a passive Wisdom (Perception) of 14.</p>\r\n<p><strong>What Can You See?</strong> One of the main factors in determining whether you can find a hidden creature or object is how well you can see in an area, which might be <strong>lightly</strong> or <strong>heavily obscured&nbsp;</strong>as explained in chapter 8, &ldquo;<a title=\"Vision and Light\" href=\"https://www.dndbeyond.com/compendium/rules/phb/adventuring#VisionandLight\">Adventuring</a>.&rdquo;</p>\r\n</blockquote>"
        },
        {
            "id": 3,
            "entityTypeId": 1472902489,
            "key": "CON",
            "name": "Constitution",
            "compendiumText": "<p>Constitution measures health, stamina, and vital force.</p>\r\n<h4 id=\"ConstitutionChecks\">Constitution Checks</h4>\r\n<p>Constitution checks are uncommon, and no skills apply to Constitution checks, because the endurance this ability represents is largely passive rather than involving a specific effort on the part of a character or monster. A Constitution check can model your attempt to push beyond normal limits, however.</p>\r\n<p>The DM might call for a Constitution check when you try to accomplish tasks like the following:</p>\r\n<ul>\r\n<li>Hold your breath</li>\r\n<li>March or labor for hours without rest</li>\r\n<li>Go without sleep</li>\r\n<li>Survive without food or water</li>\r\n<li>Quaff an entire stein of ale in one go</li>\r\n</ul>\r\n<h4 id=\"HitPoints\">Hit Points</h4>\r\n<p>Your Constitution modifier contributes to your hit points. Typically, you add your Constitution modifier to each Hit Die you roll for your hit points.</p>\r\n<p>If your Constitution modifier changes, your hit point maximum changes as well, as though you had the new modifier from 1st level. For example, if you raise your Constitution score when you reach 4th level and your Constitution modifier increases from +1 to +2, you adjust your hit point maximum as though the modifier had always been +2. So you add 3 hit points for your first three levels, and then roll your hit points for 4th level using your new modifier. Or if you're 7th level and some effect lowers your Constitution score so as to reduce your Constitution modifier by 1, your hit point maximum is reduced by 7.</p>"
        },
        {
            "id": 4,
            "entityTypeId": 1472902489,
            "key": "INT",
            "name": "Intelligence",
            "compendiumText": "<p>Intelligence measures mental acuity, accuracy of recall, and the ability to reason.</p>\r\n<h4 id=\"IntelligenceChecks\">Intelligence Checks</h4>\r\n<p>An Intelligence check comes into play when you need to draw on logic, education, memory, or deductive reasoning. The Arcana, History, Investigation, Nature, and Religion skills reflect aptitude in certain kinds of Intelligence checks.</p>\r\n<h5 id=\"Arcana\">Arcana</h5>\r\n<p>Your Intelligence (Arcana) check measures your ability to recall lore about spells, magic items, eldritch symbols, magical traditions, the planes of existence, and the inhabitants of those planes.</p>\r\n<h5 id=\"History\">History</h5>\r\n<p>Your Intelligence (History) check measures your ability to recall lore about historical events, legendary people, ancient kingdoms, past disputes, recent wars, and lost civilizations.</p>\r\n<h5 id=\"Investigation\">Investigation</h5>\r\n<p>When you look around for clues and make deductions based on those clues, you make an Intelligence (Investigation) check. You might deduce the location of a hidden object, discern from the appearance of a wound what kind of weapon dealt it, or determine the weakest point in a tunnel that could cause it to collapse. Poring through ancient scrolls in search of a hidden fragment of knowledge might also call for an Intelligence (Investigation) check.</p>\r\n<h5 id=\"Nature\">Nature</h5>\r\n<p>Your Intelligence (Nature) check measures your ability to recall lore about terrain, plants and animals, the weather, and natural cycles.</p>\r\n<h5 id=\"Religion\">Religion</h5>\r\n<p>Your Intelligence (Religion) check measures your ability to recall lore about deities, rites and prayers, religious hierarchies, holy symbols, and the practices of secret cults.</p>\r\n<h5 id=\"OtherIntelligenceChecks\">Other Intelligence Checks</h5>\r\n<p>The DM might call for an Intelligence check when you try to accomplish tasks like the following:</p>\r\n<ul>\r\n<li>Communicate with a creature without using words</li>\r\n<li>Estimate the value of a precious item</li>\r\n<li>Pull together a disguise to pass as a city guard</li>\r\n<li>Forge a document</li>\r\n<li>Recall lore about a craft or trade</li>\r\n<li>Win a game of skill</li>\r\n</ul>\r\n<h4 id=\"SpellcastingAbility\">Spellcasting Ability</h4>\r\n<p>Wizards use Intelligence as their spellcasting ability, which helps determine the saving throw DCs of spells they cast.</p>"
        },
        {
            "id": 5,
            "entityTypeId": 1472902489,
            "key": "WIS",
            "name": "Wisdom",
            "compendiumText": "<p>Wisdom reflects how attuned you are to the world around you and represents perceptiveness and intuition.</p>\r\n<h4 id=\"WisdomChecks\">Wisdom Checks</h4>\r\n<p>A Wisdom check might reflect an effort to read body language, understand someone’s feelings, notice things about the environment, or care for an injured person. The Animal Handling, Insight, Medicine, Perception, and Survival skills reflect aptitude in certain kinds of Wisdom checks.</p>\r\n<h5 id=\"AnimalHandling\">Animal Handling</h5>\r\n<p>When there is any question whether you can calm down a domesticated animal, keep a mount from getting spooked, or intuit an animal’s intentions, the DM might call for a Wisdom (Animal Handling) check. You also make a Wisdom (Animal Handling) check to control your mount when you attempt a risky maneuver.</p>\r\n<h5 id=\"Insight\">Insight</h5>\r\n<p>Your Wisdom (Insight) check decides whether you can determine the true intentions of a creature, such as when searching out a lie or predicting someone’s next move. Doing so involves gleaning clues from body language, speech habits, and changes in mannerisms.</p>\r\n<h5 id=\"Medicine\">Medicine</h5>\r\n<p>A Wisdom (Medicine) check lets you try to stabilize a dying companion or diagnose an illness.</p>\r\n<h5 id=\"Perception\">Perception</h5>\r\n<p>Your Wisdom (Perception) check lets you spot, hear, or otherwise detect the presence of something. It measures your general awareness of your surroundings and the keenness of your senses. For example, you might try to hear a conversation through a closed door, eavesdrop under an open window, or hear monsters moving stealthily in the forest. Or you might try to spot things that are obscured or easy to miss, whether they are orcs lying in ambush on a road, thugs hiding in the shadows of an alley, or candlelight under a closed secret door.</p>\r\n<aside>\r\n<blockquote>\r\n<p id=\"finding-a-hidden-object\"><strong>FINDING A HIDDEN OBJECT</strong></p>\r\n<p>When your character searches for a hidden object such as a secret door or a trap, the DM typically asks you to make a Wisdom (Perception) check. Such a check can be used to find hidden details or other information and clues that you might otherwise overlook.</p>\r\n<p>In most cases, you need to describe where you are looking in order for the DM to determine your chance of success. For example, a key is hidden beneath a set of folded clothes in the top drawer of a bureau. If you tell the DM that you pace around the room, looking at the walls and furniture for clues, you have no chance of finding the key, regardless of your Wisdom (Perception) check result. You would have to specify that you were opening the drawers or searching the bureau in order to have any chance of success.</p>\r\n</blockquote>\r\n</aside>\r\n<h5 id=\"Survival\">Survival</h5>\r\n<p>The DM might ask you to make a Wisdom (Survival) check to follow tracks, hunt wild game, guide your group through frozen wastelands, identify signs that owlbears live nearby, predict the weather, or avoid quicksand and other natural hazards.</p>\r\n<h5 id=\"OtherWisdomChecks\">Other Wisdom Checks</h5>\r\n<p>The DM might call for a Wisdom check when you try to accomplish tasks like the following:</p>\r\n<ul>\r\n<li>Get a gut feeling about what course of action to follow</li>\r\n<li>Discern whether a seemingly dead or living creature is undead</li>\r\n</ul>\r\n<h4 id=\"SpellcastingAbility\">Spellcasting Ability</h4>\r\n<p>Clerics, druids, and rangers use Wisdom as their spellcasting ability, which helps determine the saving throw DCs of spells they cast.</p>"
        },
        {
            "id": 6,
            "entityTypeId": 1472902489,
            "key": "CHA",
            "name": "Charisma",
            "compendiumText": "<p>Charisma measures your ability to interact effectively with others. It includes such factors as confidence and eloquence, and it can represent a charming or commanding personality.</p>\r\n<h4 id=\"CharismaChecks\">Charisma Checks</h4>\r\n<p>A Charisma check might arise when you try to influence or entertain others, when you try to make an impression or tell a convincing lie, or when you are navigating a tricky social situation. The Deception, Intimidation, Performance, and Persuasion skills reflect aptitude in certain kinds of Charisma checks.</p>\r\n<h5 id=\"Deception\">Deception</h5>\r\n<p>Your Charisma (Deception) check determines whether you can convincingly hide the truth, either verbally or through your actions. This deception can encompass everything from misleading others through ambiguity to telling outright lies. Typical situations include trying to fast-talk a guard, con a merchant, earn money through gambling, pass yourself off in a disguise, dull someone's suspicions with false assurances, or maintain a straight face while telling a blatant lie.</p>\r\n<h5 id=\"Intimidation\">Intimidation</h5>\r\n<p>When you attempt to influence someone through overt threats, hostile actions, and physical violence, the DM might ask you to make a Charisma (Intimidation) check. Examples include trying to pry information out of a prisoner, convincing street thugs to back down from a confrontation, or using the edge of a broken bottle to convince a sneering vizier to reconsider a decision.</p>\r\n<h5 id=\"Performance\">Performance</h5>\r\n<p>Your Charisma (Performance) check determines how well you can delight an audience with music, dance, acting, storytelling, or some other form of entertainment.</p>\r\n<h5 id=\"Persuasion\">Persuasion</h5>\r\n<p>When you attempt to influence someone or a group of people with tact, social graces, or good nature, the DM might ask you to make a Charisma (Persuasion) check. Typically, you use persuasion when acting in good faith, to foster friendships, make cordial requests, or exhibit proper etiquette. Examples of persuading others include convincing a chamberlain to let your party see the king, negotiating peace between warring tribes, or inspiring a crowd of townsfolk.</p>\r\n<h5 id=\"OtherCharismaChecks\">Other Charisma Checks</h5>\r\n<p>The DM might call for a Charisma check when you try to accomplish tasks like the following:</p>\r\n<ul>\r\n<li>Find the best person to talk to for news, rumors, and gossip</li>\r\n<li>Blend into a crowd to get the sense of key topics of conversation</li>\r\n</ul>\r\n<h4 id=\"SpellcastingAbility\">Spellcasting Ability</h4>\r\n<p>Bards, paladins, sorcerers, and warlocks use Charisma as their spellcasting ability, which helps determine the saving throw DCs of spells they cast.</p>"
        }
    ],
    "statModifiers": [
        {
            "value": 1,
            "modifier": -5
        },
        {
            "value": 2,
            "modifier": -4
        },
        {
            "value": 3,
            "modifier": -4
        },
        {
            "value": 4,
            "modifier": -3
        },
        {
            "value": 5,
            "modifier": -3
        },
        {
            "value": 6,
            "modifier": -2
        },
        {
            "value": 7,
            "modifier": -2
        },
        {
            "value": 8,
            "modifier": -1
        },
        {
            "value": 9,
            "modifier": -1
        },
        {
            "value": 10,
            "modifier": 0
        },
        {
            "value": 11,
            "modifier": 0
        },
        {
            "value": 12,
            "modifier": 1
        },
        {
            "value": 13,
            "modifier": 1
        },
        {
            "value": 14,
            "modifier": 2
        },
        {
            "value": 15,
            "modifier": 2
        },
        {
            "value": 16,
            "modifier": 3
        },
        {
            "value": 17,
            "modifier": 3
        },
        {
            "value": 18,
            "modifier": 4
        },
        {
            "value": 19,
            "modifier": 4
        },
        {
            "value": 20,
            "modifier": 5
        },
        {
            "value": 21,
            "modifier": 5
        },
        {
            "value": 22,
            "modifier": 6
        },
        {
            "value": 23,
            "modifier": 6
        },
        {
            "value": 24,
            "modifier": 7
        },
        {
            "value": 25,
            "modifier": 7
        },
        {
            "value": 26,
            "modifier": 8
        },
        {
            "value": 27,
            "modifier": 8
        },
        {
            "value": 28,
            "modifier": 9
        },
        {
            "value": 29,
            "modifier": 9
        },
        {
            "value": 30,
            "modifier": 10
        }
    ],
    "levelProficiencyBonuses": [
        {
            "level": 1,
            "bonus": 2
        },
        {
            "level": 2,
            "bonus": 2
        },
        {
            "level": 3,
            "bonus": 2
        },
        {
            "level": 4,
            "bonus": 2
        },
        {
            "level": 5,
            "bonus": 3
        },
        {
            "level": 6,
            "bonus": 3
        },
        {
            "level": 7,
            "bonus": 3
        },
        {
            "level": 8,
            "bonus": 3
        },
        {
            "level": 9,
            "bonus": 4
        },
        {
            "level": 10,
            "bonus": 4
        },
        {
            "level": 11,
            "bonus": 4
        },
        {
            "level": 12,
            "bonus": 4
        },
        {
            "level": 13,
            "bonus": 5
        },
        {
            "level": 14,
            "bonus": 5
        },
        {
            "level": 15,
            "bonus": 5
        },
        {
            "level": 16,
            "bonus": 5
        },
        {
            "level": 17,
            "bonus": 6
        },
        {
            "level": 18,
            "bonus": 6
        },
        {
            "level": 19,
            "bonus": 6
        },
        {
            "level": 20,
            "bonus": 6
        }
    ],
    "abilitySkills": [
        {
            "id": 2,
            "entityTypeId": 1958004211,
            "stat": 1,
            "name": "Athletics",
            "description": "<p>Your Strength (Athletics) check covers difficult situations you encounter while climbing, jumping, or swimming. Examples include the following activities:</p>\r\n<ul>\r\n<li>You attempt to climb a sheer or slippery cliff, avoid hazards while scaling a wall, or cling to a surface while something is trying to knock you off.</li>\r\n<li>You try to jump an unusually long distance or pull off a stunt midjump.</li>\r\n<li>You struggle to swim or stay afloat in treacherous currents, storm-tossed waves, or areas of thick seaweed. Or another creature tries to push or pull you underwater or otherwise interfere with your swimming.</li>\r\n</ul>"
        },
        {
            "id": 3,
            "entityTypeId": 1958004211,
            "stat": 2,
            "name": "Acrobatics",
            "description": "<p>Your Dexterity (Acrobatics) check covers your attempt to stay on your feet in a tricky situation, such as when you're trying to run across a sheet of ice, balance on a tightrope, or stay upright on a rocking ship's deck. The GM might also call for a Dexterity (Acrobatics) check to see if you can perform acrobatic stunts, including dives, rolls, somersaults, and flips.</p>"
        },
        {
            "id": 4,
            "entityTypeId": 1958004211,
            "stat": 2,
            "name": "Sleight of Hand",
            "description": "<p>Whenever you attempt an act of legerdemain or manual trickery, such as planting something on someone else or concealing an object on your person, make a Dexterity (Sleight of Hand) check. The GM might also call for a Dexterity (Sleight of Hand) check to determine whether you can lift a coin purse off another person or slip something out of another person's pocket.</p>\r\n"
        },
        {
            "id": 5,
            "entityTypeId": 1958004211,
            "stat": 2,
            "name": "Stealth",
            "description": "<p>Make a Dexterity (Stealth) check when you attempt to conceal yourself from enemies, slink past guards, slip away without being noticed, or sneak up on someone without being seen or heard.</p>"
        },
        {
            "id": 6,
            "entityTypeId": 1958004211,
            "stat": 4,
            "name": "Arcana",
            "description": "<p>Your Intelligence (Arcana) check measures your ability to recall lore about spells, magic items, eldritch symbols, magical traditions, the planes of existence, and the inhabitants of those planes.</p>"
        },
        {
            "id": 7,
            "entityTypeId": 1958004211,
            "stat": 4,
            "name": "History",
            "description": "<p>Your Intelligence (History) check measures your ability to recall lore about historical events, legendary people, ancient kingdoms, past disputes, recent wars, and lost civilizations.</p>"
        },
        {
            "id": 8,
            "entityTypeId": 1958004211,
            "stat": 4,
            "name": "Investigation",
            "description": "<p>When you look around for clues and make deductions based on those clues, you make an Intelligence (Investigation) check. You might deduce the location of a hidden object, discern from the appearance of a wound what kind of weapon dealt it, or determine the weakest point in a tunnel that could cause it to collapse. Poring through ancient scrolls in search of a hidden fragment of knowledge might also call for an Intelligence (Investigation) check.</p>\r\n"
        },
        {
            "id": 9,
            "entityTypeId": 1958004211,
            "stat": 4,
            "name": "Nature",
            "description": "<p>Your Intelligence (Nature) check measures your ability to recall lore about terrain, plants and animals, the weather, and natural cycles.</p>"
        },
        {
            "id": 10,
            "entityTypeId": 1958004211,
            "stat": 4,
            "name": "Religion",
            "description": "<p>Your Intelligence (Religion) check measures your ability to recall lore about deities, rites and prayers, religious hierarchies, holy symbols, and the practices of secret cults.</p>"
        },
        {
            "id": 11,
            "entityTypeId": 1958004211,
            "stat": 5,
            "name": "Animal Handling",
            "description": "<p>When there is any question whether you can calm down a domesticated animal, keep a mount from getting spooked, or intuit an animal&rsquo;s intentions, the GM might call for a Wisdom (Animal Handling) check. You also make a Wisdom (Animal Handling) check to control your mount when you attempt a risky maneuver.</p>"
        },
        {
            "id": 12,
            "entityTypeId": 1958004211,
            "stat": 5,
            "name": "Insight",
            "description": "<p>Your Wisdom (Insight) check decides whether you can determine the true intentions of a creature, such as when searching out a lie or predicting someone&rsquo;s next move. Doing so involves gleaning clues from body language, speech habits, and changes in mannerisms.</p>\r\n"
        },
        {
            "id": 13,
            "entityTypeId": 1958004211,
            "stat": 5,
            "name": "Medicine",
            "description": "<p>A Wisdom (Medicine) check lets you try to stabilize a dying companion or diagnose an illness.</p>"
        },
        {
            "id": 14,
            "entityTypeId": 1958004211,
            "stat": 5,
            "name": "Perception",
            "description": "<p>Your Wisdom (Perception) check lets you spot, hear, or otherwise detect the presence of something. It measures your general awareness of your surroundings and the keenness of your senses. For example, you might try to hear a conversation through a closed door, eavesdrop under an open window, or hear monsters moving stealthily in the forest. Or you might try to spot things that are obscured or easy to miss, whether they are orcs lying in ambush on a road, thugs hiding in the shadows of an alley, or candlelight under a closed secret door.</p>\r\n"
        },
        {
            "id": 15,
            "entityTypeId": 1958004211,
            "stat": 5,
            "name": "Survival",
            "description": "<p>The GM might ask you to make a Wisdom (Survival) check to follow tracks, hunt wild game, guide your group through frozen wastelands, identify signs that owlbears live nearby, predict the weather, or avoid quicksand and other natural hazards.</p>"
        },
        {
            "id": 16,
            "entityTypeId": 1958004211,
            "stat": 6,
            "name": "Deception",
            "description": "<p>Your Charisma (Deception) check determines whether you can convincingly hide the truth, either verbally or through your actions. This deception can encompass everything from misleading others through ambiguity to telling outright lies. Typical situations include trying to fast-talk a guard, con a merchant, earn money through gambling, pass yourself off in a disguise, dull someone's suspicions with false assurances, or maintain a straight face while telling a blatant lie.</p>\r\n"
        },
        {
            "id": 17,
            "entityTypeId": 1958004211,
            "stat": 6,
            "name": "Intimidation",
            "description": "<p>When you attempt to influence someone through overt threats, hostile actions, and physical violence, the GM might ask you to make a Charisma (Intimidation) check. Examples include trying to pry information out of a prisoner, convincing street thugs to back down from a confrontation, or using the edge of a broken bottle to convince a sneering vizier to reconsider a decision.</p>\r\n"
        },
        {
            "id": 18,
            "entityTypeId": 1958004211,
            "stat": 6,
            "name": "Performance",
            "description": "<p>Your Charisma (Performance) check determines how well you can delight an audience with music, dance, acting, storytelling, or some other form of entertainment.</p>"
        },
        {
            "id": 19,
            "entityTypeId": 1958004211,
            "stat": 6,
            "name": "Persuasion",
            "description": "<p>When you attempt to influence someone or a group of people with tact, social graces, or good nature, the GM might ask you to make a Charisma (Persuasion) check. Typically, you use persuasion when acting in good faith, to foster friendships, make cordial requests, or exhibit proper etiquette. Examples of persuading others include convincing a chamberlain to let your party see the king, negotiating peace between warring tribes, or inspiring a crowd of townsfolk.</p>\r\n"
        }
    ],
    "conditions": [
        {
            "definition": {
                "id": 1,
                "entityTypeId": 1737492944,
                "name": "Blinded",
                "type": 1,
                "description": "<ul>\r\n<li>A blinded creature can't see and automatically fails any ability check that requires sight.</li>\r\n<li>Attack rolls against the creature have advantage, and the creature's attack rolls have disadvantage.</li>\r\n</ul>",
                "slug": "blinded",
                "levels": []
            }
        },
        {
            "definition": {
                "id": 2,
                "entityTypeId": 1737492944,
                "name": "Charmed",
                "type": 1,
                "description": "<ul>\r\n<li>A charmed creature can't attack the charmer or target the charmer with harmful abilities or magical effects.</li>\r\n<li>The charmer has advantage on any ability check to interact socially with the creature.</li>\r\n</ul>",
                "slug": "charmed",
                "levels": []
            }
        },
        {
            "definition": {
                "id": 3,
                "entityTypeId": 1737492944,
                "name": "Deafened",
                "type": 1,
                "description": "<ul>\r\n<li>A deafened creature can't hear and automatically fails any ability check that requires hearing.</li>\r\n</ul>",
                "slug": "deafened",
                "levels": []
            }
        },
        {
            "definition": {
                "id": 4,
                "entityTypeId": 1737492944,
                "name": "Exhaustion",
                "type": 2,
                "description": "<p>Some special abilities and environmental hazards, such as starvation and the long-term effects of freezing or scorching temperatures, can lead to a special condition called exhaustion. Exhaustion is measured in six levels. An effect can give a creature one or more levels of exhaustion, as specified in the effect's description.</p>\r\n<table class=\"exhaustion-levels\">\r\n<thead>\r\n<tr>\r\n<th class=\"exhaustionlevel\">Level</th>\r\n<th>Effect</th>\r\n</tr>\r\n</thead>\r\n<tbody>\r\n<tr>\r\n<td>1</td>\r\n<td style=\"text-align: left;\">Disadvantage on ability checks</td>\r\n</tr>\r\n<tr>\r\n<td>2</td>\r\n<td style=\"text-align: left;\">Speed halved</td>\r\n</tr>\r\n<tr>\r\n<td>3</td>\r\n<td style=\"text-align: left;\">Disadvantage on attack rolls and saving throws</td>\r\n</tr>\r\n<tr>\r\n<td>4</td>\r\n<td style=\"text-align: left;\">Hit point maximum halved</td>\r\n</tr>\r\n<tr>\r\n<td>5</td>\r\n<td style=\"text-align: left;\">Speed reduced to 0</td>\r\n</tr>\r\n<tr>\r\n<td>6</td>\r\n<td style=\"text-align: left;\">Death</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p>If an already exhausted creature suffers another effect that causes exhaustion, its current level of exhaustion increases by the amount specified in the effect's description.</p>\r\n<p>A creature suffers the effect of its current level of exhaustion as well as all lower levels. For example, a creature suffering level 2 exhaustion has its speed halved and has disadvantage on ability checks.</p>\r\n<p>An effect that removes exhaustion reduces its level as specified in the effect's description, with all exhaustion effects ending if a creature's exhaustion level is reduced below 1. <br /> Finishing a long rest reduces a creature's exhaustion level by 1, provided that the creature has also ingested some food and drink.</p>",
                "slug": "exhaustion",
                "levels": [
                    {
                        "definition": {
                            "id": 1,
                            "entityTypeId": 2064013312,
                            "level": 1,
                            "effect": "Disadvantage on ability checks"
                        }
                    },
                    {
                        "definition": {
                            "id": 2,
                            "entityTypeId": 2064013312,
                            "level": 2,
                            "effect": "Speed halved"
                        }
                    },
                    {
                        "definition": {
                            "id": 3,
                            "entityTypeId": 2064013312,
                            "level": 3,
                            "effect": "Disadvantage on attack rolls and saving throws"
                        }
                    },
                    {
                        "definition": {
                            "id": 4,
                            "entityTypeId": 2064013312,
                            "level": 4,
                            "effect": "Hit point maximum halved"
                        }
                    },
                    {
                        "definition": {
                            "id": 5,
                            "entityTypeId": 2064013312,
                            "level": 5,
                            "effect": "Speed reduced to 0"
                        }
                    },
                    {
                        "definition": {
                            "id": 6,
                            "entityTypeId": 2064013312,
                            "level": 6,
                            "effect": "Death"
                        }
                    }
                ]
            }
        },
        {
            "definition": {
                "id": 5,
                "entityTypeId": 1737492944,
                "name": "Frightened",
                "type": 1,
                "description": "<ul>\r\n<li>A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight.</li>\r\n<li>The creature can't willingly move closer to the source of its fear.</li>\r\n</ul>",
                "slug": "frightened",
                "levels": []
            }
        },
        {
            "definition": {
                "id": 6,
                "entityTypeId": 1737492944,
                "name": "Grappled",
                "type": 1,
                "description": "<ul>\r\n<li>A grappled creature's speed becomes 0, and it can't benefit from any bonus to its speed.</li>\r\n<li>The condition ends if the grappler is incapacitated (see the condition).</li>\r\n<li>The condition also ends if an effect removes the grappled creature from the reach of the grappler or grappling effect, such as when a creature is hurled away by the <strong>thunder-wave</strong> spell.</li>\r\n</ul>",
                "slug": "grappled",
                "levels": []
            }
        },
        {
            "definition": {
                "id": 7,
                "entityTypeId": 1737492944,
                "name": "Incapacitated",
                "type": 1,
                "description": "<ul>\r\n<li>An incapacitated creature can't take actions or reactions.</li>\r\n</ul>",
                "slug": "incapacitated",
                "levels": []
            }
        },
        {
            "definition": {
                "id": 8,
                "entityTypeId": 1737492944,
                "name": "Invisible",
                "type": 1,
                "description": "<ul>\r\n<li>An invisible creature is impossible to see without the aid of magic or a special sense. For the purpose of hiding, the creature is heavily obscured. The creature's location can be detected by any noise it makes or any tracks it leaves.</li>\r\n<li>Attack rolls against the creature have disadvantage, and the creature's attack rolls have advantage.</li>\r\n</ul>",
                "slug": "invisible",
                "levels": []
            }
        },
        {
            "definition": {
                "id": 9,
                "entityTypeId": 1737492944,
                "name": "Paralyzed",
                "type": 1,
                "description": "<ul>\r\n<li>A paralyzed creature is incapacitated (see the condition) and can't move or speak.</li>\r\n<li>The creature automatically fails Strength and Dexterity saving throws. Attack rolls against the creature have advantage.</li>\r\n<li>Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.</li>\r\n</ul>",
                "slug": "paralyzed",
                "levels": []
            }
        },
        {
            "definition": {
                "id": 10,
                "entityTypeId": 1737492944,
                "name": "Petrified",
                "type": 1,
                "description": "<ul>\r\n<li>A petrified creature is transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone). Its weight increases by a factor of ten, and it ceases aging.</li>\r\n<li>The creature is incapacitated (see the condition), can't move or speak, and is unaware of its surroundings.</li>\r\n<li>Attack rolls against the creature have advantage.</li>\r\n<li>The creature automatically fails Strength and Dexterity saving throws.</li>\r\n<li>The creature has resistance to all damage.</li>\r\n<li>The creature is immune to poison and disease, although a poison or disease already in its system is suspended, not neutralized.</li>\r\n</ul>",
                "slug": "petrified",
                "levels": []
            }
        },
        {
            "definition": {
                "id": 11,
                "entityTypeId": 1737492944,
                "name": "Poisoned",
                "type": 1,
                "description": "<ul>\r\n<li>A poisoned creature has disadvantage on attack rolls and ability checks.</li>\r\n</ul>",
                "slug": "poisoned",
                "levels": []
            }
        },
        {
            "definition": {
                "id": 12,
                "entityTypeId": 1737492944,
                "name": "Prone",
                "type": 1,
                "description": "<ul>\r\n<li>A prone creature's only movement option is to crawl, unless it stands up and thereby ends the condition.</li>\r\n<li>The creature has disadvantage on attack rolls.</li>\r\n<li>An attack roll against the creature has advantage if the attacker is within 5 feet of the creature. Otherwise, the attack roll has disadvantage.</li>\r\n</ul>",
                "slug": "prone",
                "levels": []
            }
        },
        {
            "definition": {
                "id": 13,
                "entityTypeId": 1737492944,
                "name": "Restrained",
                "type": 1,
                "description": "<ul>\r\n<li>A restrained creature's speed becomes 0, and it can't benefit from any bonus to its speed.</li>\r\n<li>Attack rolls against the creature have advantage, and the creature's attack rolls have disadvantage.</li>\r\n<li>The creature has disadvantage on Dexterity saving throws.</li>\r\n</ul>",
                "slug": "restrained",
                "levels": []
            }
        },
        {
            "definition": {
                "id": 14,
                "entityTypeId": 1737492944,
                "name": "Stunned",
                "type": 1,
                "description": "<ul>\r\n<li>A stunned creature is incapacitated (see the condition), can't move, and can speak only falteringly.</li>\r\n<li>The creature automatically fails Strength and Dexterity saving throws.</li>\r\n<li>Attack rolls against the creature have advantage.</li>\r\n</ul>",
                "slug": "stunned",
                "levels": []
            }
        },
        {
            "definition": {
                "id": 15,
                "entityTypeId": 1737492944,
                "name": "Unconscious",
                "type": 1,
                "description": "<ul>\r\n<li>An unconscious creature is incapacitated (see the condition), can't move or speak, and is unaware of its surroundings</li>\r\n<li>The creature drops whatever it's holding and falls prone.</li>\r\n<li>The creature automatically fails Strength and Dexterity saving throws.</li>\r\n<li>Attack rolls against the creature have advantage.</li>\r\n<li>Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.</li>\r\n</ul>",
                "slug": "unconscious",
                "levels": []
            }
        }
    ],
    "damageAdjustments": [
        {
            "id": 1,
            "name": "Bludgeoning",
            "type": 1,
            "displayOrder": 0,
            "slug": "bludgeoning",
            "isMulti": false
        },
        {
            "id": 2,
            "name": "Piercing",
            "type": 1,
            "displayOrder": 0,
            "slug": "piercing",
            "isMulti": false
        },
        {
            "id": 3,
            "name": "Slashing",
            "type": 1,
            "displayOrder": 0,
            "slug": "slashing",
            "isMulti": false
        },
        {
            "id": 4,
            "name": "Lightning",
            "type": 1,
            "displayOrder": 0,
            "slug": "lightning",
            "isMulti": false
        },
        {
            "id": 5,
            "name": "Thunder",
            "type": 1,
            "displayOrder": 0,
            "slug": "thunder",
            "isMulti": false
        },
        {
            "id": 6,
            "name": "Poison",
            "type": 1,
            "displayOrder": 0,
            "slug": "poison",
            "isMulti": false
        },
        {
            "id": 7,
            "name": "Cold",
            "type": 1,
            "displayOrder": 0,
            "slug": "cold",
            "isMulti": false
        },
        {
            "id": 8,
            "name": "Radiant",
            "type": 1,
            "displayOrder": 0,
            "slug": "radiant",
            "isMulti": false
        },
        {
            "id": 9,
            "name": "Fire",
            "type": 1,
            "displayOrder": 0,
            "slug": "fire",
            "isMulti": false
        },
        {
            "id": 10,
            "name": "Necrotic",
            "type": 1,
            "displayOrder": 0,
            "slug": "necrotic",
            "isMulti": false
        },
        {
            "id": 11,
            "name": "Acid",
            "type": 1,
            "displayOrder": 0,
            "slug": "acid",
            "isMulti": false
        },
        {
            "id": 12,
            "name": "Psychic",
            "type": 1,
            "displayOrder": 0,
            "slug": "psychic",
            "isMulti": false
        },
        {
            "id": 13,
            "name": "Bludgeoning, Piercing, and Slashing from Nonmagical Attacks",
            "type": 1,
            "displayOrder": 0,
            "slug": "bludgeoning-piercing-and-slashing-from-nonmagical-attacks",
            "isMulti": true
        },
        {
            "id": 14,
            "name": "Bludgeoning, Piercing, and Slashing from Nonmagical Attacks that aren't Silvered",
            "type": 1,
            "displayOrder": 0,
            "slug": "bludgeoning-piercing-and-slashing-from-nonmagical-attacks-that-arent-silvered",
            "isMulti": true
        },
        {
            "id": 15,
            "name": "Bludgeoning, Piercing, and Slashing from Nonmagical Attacks that aren't Adamantine",
            "type": 1,
            "displayOrder": 0,
            "slug": "bludgeoning-piercing-and-slashing-from-nonmagical-attacks-that-arent-adamantine",
            "isMulti": true
        },
        {
            "id": 16,
            "name": "Piercing and Slashing from Nonmagical Attacks that aren't Adamantine",
            "type": 1,
            "displayOrder": 0,
            "slug": "piercing-and-slashing-from-nonmagical-attacks-that-arent-adamantine",
            "isMulti": true
        },
        {
            "id": 17,
            "name": "Bludgeoning",
            "type": 2,
            "displayOrder": 0,
            "slug": "bludgeoning",
            "isMulti": false
        },
        {
            "id": 18,
            "name": "Piercing",
            "type": 2,
            "displayOrder": 0,
            "slug": "piercing",
            "isMulti": false
        },
        {
            "id": 19,
            "name": "Slashing",
            "type": 2,
            "displayOrder": 0,
            "slug": "slashing",
            "isMulti": false
        },
        {
            "id": 20,
            "name": "Lightning",
            "type": 2,
            "displayOrder": 0,
            "slug": "lightning",
            "isMulti": false
        },
        {
            "id": 21,
            "name": "Thunder",
            "type": 2,
            "displayOrder": 0,
            "slug": "thunder",
            "isMulti": false
        },
        {
            "id": 22,
            "name": "Poison",
            "type": 2,
            "displayOrder": 0,
            "slug": "poison",
            "isMulti": false
        },
        {
            "id": 23,
            "name": "Cold",
            "type": 2,
            "displayOrder": 0,
            "slug": "cold",
            "isMulti": false
        },
        {
            "id": 24,
            "name": "Radiant",
            "type": 2,
            "displayOrder": 0,
            "slug": "radiant",
            "isMulti": false
        },
        {
            "id": 25,
            "name": "Fire",
            "type": 2,
            "displayOrder": 0,
            "slug": "fire",
            "isMulti": false
        },
        {
            "id": 26,
            "name": "Necrotic",
            "type": 2,
            "displayOrder": 0,
            "slug": "necrotic",
            "isMulti": false
        },
        {
            "id": 27,
            "name": "Acid",
            "type": 2,
            "displayOrder": 0,
            "slug": "acid",
            "isMulti": false
        },
        {
            "id": 28,
            "name": "Psychic",
            "type": 2,
            "displayOrder": 0,
            "slug": "psychic",
            "isMulti": false
        },
        {
            "id": 29,
            "name": "Bludgeoning, Piercing, and Slashing from Nonmagical Attacks",
            "type": 2,
            "displayOrder": 0,
            "slug": "bludgeoning-piercing-and-slashing-from-nonmagical-attacks",
            "isMulti": true
        },
        {
            "id": 30,
            "name": "Bludgeoning, Piercing, and Slashing from Nonmagical Attacks that aren't Silvered",
            "type": 2,
            "displayOrder": 0,
            "slug": "bludgeoning-piercing-and-slashing-from-nonmagical",
            "isMulti": true
        },
        {
            "id": 31,
            "name": "Bludgeoning, Piercing, and Slashing from Nonmagical Attacks that aren't Adamantine",
            "type": 2,
            "displayOrder": 0,
            "slug": "bludgeoning-piercing-and-slashing-from-nonmagical",
            "isMulti": true
        },
        {
            "id": 32,
            "name": "Piercing and Slashing from Nonmagical Attacks that aren't Adamantine",
            "type": 2,
            "displayOrder": 0,
            "slug": "piercing-and-slashing-from-nonmagical-attacks-that",
            "isMulti": true
        },
        {
            "id": 33,
            "name": "Bludgeoning",
            "type": 3,
            "displayOrder": 0,
            "slug": "bludgeoning",
            "isMulti": false
        },
        {
            "id": 34,
            "name": "Piercing",
            "type": 3,
            "displayOrder": 0,
            "slug": "piercing",
            "isMulti": false
        },
        {
            "id": 35,
            "name": "Slashing",
            "type": 3,
            "displayOrder": 0,
            "slug": "slashing",
            "isMulti": false
        },
        {
            "id": 36,
            "name": "Lightning",
            "type": 3,
            "displayOrder": 0,
            "slug": "lightning",
            "isMulti": false
        },
        {
            "id": 37,
            "name": "Thunder",
            "type": 3,
            "displayOrder": 0,
            "slug": "thunder",
            "isMulti": false
        },
        {
            "id": 38,
            "name": "Poison",
            "type": 3,
            "displayOrder": 0,
            "slug": "poison",
            "isMulti": false
        },
        {
            "id": 39,
            "name": "Cold",
            "type": 3,
            "displayOrder": 0,
            "slug": "cold",
            "isMulti": false
        },
        {
            "id": 40,
            "name": "Radiant",
            "type": 3,
            "displayOrder": 0,
            "slug": "radiant",
            "isMulti": false
        },
        {
            "id": 41,
            "name": "Fire",
            "type": 3,
            "displayOrder": 0,
            "slug": "fire",
            "isMulti": false
        },
        {
            "id": 42,
            "name": "Necrotic",
            "type": 3,
            "displayOrder": 0,
            "slug": "necrotic",
            "isMulti": false
        },
        {
            "id": 43,
            "name": "Acid",
            "type": 3,
            "displayOrder": 0,
            "slug": "acid",
            "isMulti": false
        },
        {
            "id": 44,
            "name": "Psychic",
            "type": 3,
            "displayOrder": 0,
            "slug": "psychic",
            "isMulti": false
        },
        {
            "id": 45,
            "name": "Piercing from Magic Weapons Wielded by Good Creatures",
            "type": 3,
            "displayOrder": 0,
            "slug": "piercing-from-magic-weapons-wielded-by-good",
            "isMulti": true
        },
        {
            "id": 46,
            "name": "Bludgeoning, Piercing, and Slashing from Magic Weapons",
            "type": 1,
            "displayOrder": 0,
            "slug": "bludgeoning-piercing-and-slashing-from-magic-weapons",
            "isMulti": true
        },
        {
            "id": 47,
            "name": "Force",
            "type": 1,
            "displayOrder": 0,
            "slug": "force",
            "isMulti": false
        },
        {
            "id": 48,
            "name": "Force",
            "type": 2,
            "displayOrder": 0,
            "slug": "force",
            "isMulti": false
        },
        {
            "id": 49,
            "name": "Force",
            "type": 3,
            "displayOrder": 0,
            "slug": "force",
            "isMulti": false
        },
        {
            "id": 50,
            "name": "Bludgeoning, Piercing, and Slashing from Nonmagical Attacks while in Dim Light or Darkness",
            "type": 1,
            "displayOrder": 0,
            "slug": "bludgeoning-piercing-and-slashing-from-nonmagical-attacks-while-in-dim-light-or-darkness",
            "isMulti": true
        },
        {
            "id": 51,
            "name": "Ranged Attacks",
            "type": 1,
            "displayOrder": 0,
            "slug": "ranged-attacks",
            "isMulti": false
        },
        {
            "id": 52,
            "name": "Damage Dealt By Traps",
            "type": 1,
            "displayOrder": 0,
            "slug": "damage-dealt-by-traps",
            "isMulti": false
        },
        {
            "id": 53,
            "name": "All",
            "type": 1,
            "displayOrder": 0,
            "slug": "all",
            "isMulti": true
        },
        {
            "id": 54,
            "name": "Bludgeoning from non magical attacks",
            "type": 1,
            "displayOrder": 0,
            "slug": "bludgeoning-from-non-magical-attacks",
            "isMulti": false
        },
        {
            "id": 55,
            "name": "Bludgeoning, Piercing, and Slashing from Metal Weapons",
            "type": 2,
            "displayOrder": 0,
            "slug": "slashing-from-metal-weapons",
            "isMulti": true
        },
        {
            "id": 56,
            "name": "Bludgeoning, Piercing, and Slashing while in Dim Light or Darkness",
            "type": 1,
            "displayOrder": 0,
            "slug": "bludgeoning-piercing-and-slashing-while-in-dim-or-light-darkness",
            "isMulti": true
        },
        {
            "id": 57,
            "name": "Damage from Spells",
            "type": 1,
            "displayOrder": 0,
            "slug": "damage-from-spells",
            "isMulti": false
        },
        {
            "id": 60,
            "name": "Bludgeoning, Piercing, and Slashing from Nonmagical Attacks that aren't Adamantine or Silvered",
            "type": 2,
            "displayOrder": 0,
            "slug": "bludgeoning-piercing-and-slashing-from-nonmagical-attacks-that-arent-adamantine-or-silvered",
            "isMulti": true
        },
        {
            "id": 61,
            "name": "Nonmagical Bludgeoning, Piercing, and Slashing (from Stoneskin)",
            "type": 1,
            "displayOrder": 0,
            "slug": "nonmagical-bludgeoning-piercing-and-slashing-from-stoneskin",
            "isMulti": true
        },
        {
            "id": 62,
            "name": "All damage but Force, Radiant, and Psychic",
            "type": 1,
            "displayOrder": 0,
            "slug": "all-damage-but-force-radiant-and-psychic",
            "isMulti": true
        },
        {
            "id": 63,
            "name": "Petrified (Aberrant Armor Only)",
            "type": 2,
            "displayOrder": 0,
            "slug": "petrified-aberrant-armor-only",
            "isMulti": false
        }
    ],
};

//
// Returns object:
// {
//     finalArmorClass: 5,
//     baseArmorClass: 10,  // Equal to the type of armor worn, or 10
//     dexModifer: 0,  // Characters dex mod, unless its negated by some other rule
//     unarmoredModifier: 0,  // This will include natural armor or class mod, whichever is higher
//     shieldModifier: 0, // 2 or 0, I think
//     armorType: 0, // 1-3: light, medium, heavy- defined in rules.armorTypes
//     stealthAdjustment: "Disadvantage", // usually disadvantage for heavy, blank otherwise
//     isUnarmored: true,
// }
//
function getArmor(c_json, c, modifiers) {
    let armor = {
        finalArmorClass: null,
        baseArmorClass: 10,  // Equal to the type of armor worn, or 10
        dexModifer: c.stats["dex"].modifier,  // Characters dex mod, unless its negated by some other rule
        unarmoredModifier: 0,  // This will include natural armor or class mod, whichever is higher
        shieldModifier: 0, // 2 or 0, I think
        armorType: 0, // 1-3: light, medium, heavy- defined in rules.armorTypes
        stealthAdjustment: "", // usually disadvantage for heavy, blank otherwise
        isUnarmored: true,
    }

    // Assume that if they have mage armor, they've cast it
    if (c.spells.some(({ name }) => name === 'Mage Armor')) {
        armor.baseArmorClass = 13;
    }

    // Cap dex bonus- this goes along with natural armor
    filterModifiers(modifiers, undefined, "set", "ac-max-dex-modifier").forEach(mod => {
        if (mod.value < armor.dexModifer) {
            armor.dexModifer = mod.value;
        }
    });

    // Remove dex bonus- this goes along with natural armor
    filterModifiers(modifiers, undefined, "ignore", "unarmored-dex-ac-bonus").forEach(mod => {
        if (mod.value < armor.dexModifer) {
            armor.dexModifer = 0;
        }
    });

    // If they have 'Unarmored Defense', add con mod
    filterModifiers(modifiers, undefined, "set", "unarmored-armor-class").forEach(mod => {
        // This covers barabarian and monk 'Unarmored Defense', adding con or wis
        // console.dir(mod);
        let new_unarmoredModifier = 0;
        if (mod.detail.statId != null) {
            let stat_key = ruleStatForID(mod.detail.statId).key.toLowerCase();
            new_unarmoredModifier = c.stats[stat_key].modifier;
            // if (armor.unarmoredModifier < c.stats[stat_key].modifier) {
            //     armor.unarmoredModifier = c.stats[stat_key].modifier;
            // }
        }
        // This works with natural armor (tested on Tortle), but need to remove dex bonus - above
        if (mod.detail.fixedValue != null) {
            new_unarmoredModifier += mod.detail.fixedValue;
        }
        if (armor.unarmoredModifier < new_unarmoredModifier) {
            armor.unarmoredModifier = new_unarmoredModifier;
        }
    });

    c_json.inventory.forEach(item => {
        if ((item.definition.canEquip == item.equipped) && (item.definition.canAttune == item.isAttuned)) {
            if (item.definition.armorTypeId) {
                // console.log(item);
                if (item.definition.armorTypeId == 4) { // shield
                    armor.shieldModifier = item.definition.armorClass;
                } else {
                    if (item.definition.armorTypeId == 3) {
                        // heavy armor doesn't use a dex bonus
                        armor.dexModifer = 0
                    }
                    if (item.definition.stealthCheck == 2) {
                        armor.stealthAdjustment = "Disadvantage";
                    }
                    if (armor.baseArmorClass < item.definition.armorClass) {
                        armor.baseArmorClass = item.definition.armorClass;
                    }
                }
            }
        }
    });
    // console.log("armor.baseArmorClass:", armor.baseArmorClass);
    // console.log("armor.dexModifer:", armor.dexModifer);
    // console.log("armor.unarmoredModifier:", armor.unarmoredModifier);
    // console.log("armor.shieldModifier:", armor.shieldModifier);
    armor.finalArmorClass = armor.baseArmorClass + armor.dexModifer + armor.unarmoredModifier + armor.shieldModifier;
    return armor;
}

function isItemActive(c_json, item_id) {
    let active = false;
    // console.log("looking for item:", item_id);
    c_json.inventory.forEach(item => {
        if (item.definition.id == item_id) {
            // console.log("found:", item.definition.name);
            if ((item.definition.canEquip == item.equipped) && (item.definition.canAttune == item.isAttuned)) {
                active = true;
            }
            // console.log("  active:", active);
        }
    });
    return active;
}

function getModifiers(c_json) {
    let modifiers = [];
    Object.keys(c_json.modifiers).forEach((mod_source) => {
        let mod_array = c_json.modifiers[mod_source];
        mod_array.forEach((mod, source) => {
            if ((mod_source != "item") || isItemActive(c_json, mod.componentId)) {
                console.log("mod:", mod_source, mod.type, mod.subType, mod.value);
                modifiers.push({
                    source: mod_source,
                    type: mod.type,
                    subType: mod.subType,
                    value: mod.value,
                    detail: mod,
                });
            } else {
                // console.log("  skipped mod:", mod_source, mod.type, mod.subType, mod.value);
            }
        });
    });
    return modifiers;
}

function getSpells(c_json) {
    let spells = [];
    Object.keys(c_json.spells).forEach((spell_source) => {
        let spell_array = c_json.spells[spell_source];
        if (spell_array) {
            spell_array.forEach((spell_json, source) => {
                let spell = {
                    source: spell_source,
                    name: spell_json.definition.name,
                }
                spells.push(spell);
            });
        }
    });
    return spells;
}

function calculateStat(c_json, c, modifiers, stat_score_name, stat_value) {
    stat_score_name = stat_score_name.toLowerCase();
    let set_value = null;
    let bonus = 0;
    // console.log("Calculate stat:", stat_score_name, stat_value);
    modifiers.forEach(mod => {
        if (mod.subType == stat_score_name) {
            switch (mod.type) {
                case "set":
                    set_value = (set_value < mod.value) ? mod.value : set_value;
                    break;
                case "bonus":
                    bonus += mod.value;
                    break;
                case "half-proficiency":
                case "proficiency":
                case "expertise":
                    bonus = levelProficiencyBonuses(c.characterLevel, mod.type)
                    // bonus += Math.floor(c.levelProficiencyBonus / 2);
                    break;
                // case "proficiency":
                //     bonus += c.levelProficiencyBonus;
                //     break;
                // case "expertise":
                //     bonus += c.levelProficiencyBonus * 2;
                //     break;
            }
        }
    });
    let final_value = stat_value + bonus;
    if ((set_value != null) && final_value < set_value) {
        final_value = set_value;
    }
    // console.log(`  FINAL: bonus: ${bonus}, set:${set_value} => ${final_value}`);
    return final_value;
}

function characterLevel(c_json) {
    let c_level = 0;
    Object.values(c_json.classes).forEach(c_class => {
        c_level += c_class.level;
    });
    return c_level;
}

function statModifer(stat_value) {
    let stat_modifer = rules.statModifiers.find(r_statMod => {
        if (stat_value == r_statMod.value) {
            return true;
        }
    });
    return stat_modifer.modifier;
}

function levelProficiencyBonuses(characterLevel, proficiencyLevel) {
    let profBonus = rules.levelProficiencyBonuses.find(r_statProf => {
        if (characterLevel == r_statProf.level) {
            return true;
        }
    });
    let bonus = profBonus.bonus;
    switch (proficiencyLevel) {
        case "half-proficiency":
            bonus = Math.floor(bonus / 2);
            break;
        case "expertise":
            bonus = bonus * 2;
            break;
    }

    return bonus;
}

function getSkills(c_json, c, modifiers) {
    skills = {};
    let jackOfAllTrades = filterModifiers(modifiers, undefined, "half-proficiency", "ability-checks").length >= 1;
    rules.abilitySkills.forEach(r_skill => {
        let r_stat = ruleStatForID(r_skill.stat);
        let skill_subType = r_skill.name.toLowerCase().replace(/ /g, "-")
        let skill = {
            name: r_skill.name,
            stat: r_stat.key.toLowerCase(),
            modifier: c.stats[r_stat.key.toLowerCase()].modifier,
            adjustment: "",
            restriction: ""
        };
        ["expertise", "proficiency", "half-proficiency"].every(skillType => {
            if (
                ((skillType == "half-proficiency") && jackOfAllTrades) ||
                filterModifiers(modifiers, undefined, skillType, skill_subType).length
            ) {
                console.log("prof:", skillType, skill_subType, levelProficiencyBonuses(c.characterLevel, skillType));
                skill.modifier += levelProficiencyBonuses(c.characterLevel, skillType);
                return false;
            }
            return true;
        });
        if (skill_subType == "stealth") {
            skill.adjustment = c.armor.stealthAdjustment;
        }
        filterModifiers(modifiers, undefined, "bonus", skill_subType).forEach(mod => {
            // console.log("adding: ", skill_name, mod);
            skill.modifier += mod.value;
        });
        filterModifiers(modifiers, undefined, "advantage|disadvantage", skill_subType).forEach(mod => {
            console.log("skill:", mod.source, mod.type, mod.subType, mod.value);
            skill.adjustment = mod.type;
            if (mod.detail.restriction) {
                skill.restriction = mod.detail.restriction;
            }
        });
        filterModifiers(modifiers, undefined, "bonus", "ability-checks").forEach(mod => {
            // console.log("adding: ability-checks", mod);
            skill.modifier += mod.value;
        });
        skills[r_skill.name.toLowerCase()] = skill;
    });
    return Object.fromEntries(Object.entries(skills).sort())
}

function getSaves(c_json, c, modifiers) {
    saves = {};
    Object.values(c.stats).forEach(stat => {
        let save_subType = stat.name.toLowerCase() + "-saving-throws";
        let save = {
            key: stat.key,
            name: stat.name,
            modifier: stat.modifier,
            adjustment: "",
            restriction: ""
        };

        ["expertise", "proficiency", "half-proficiency"].every(saveType => {
            if (
                filterModifiers(modifiers, undefined, saveType, save_subType).length
            ) {
                console.log("prof:", saveType, save_subType, levelProficiencyBonuses(c.characterLevel, saveType));
                save.modifier += levelProficiencyBonuses(c.characterLevel, saveType);
                return false;
            }
            return true;
        });
        filterModifiers(modifiers, undefined, "bonus", "saving-throws").forEach(mod => {
            save.modifier += mod.value;
        });
        filterModifiers(modifiers, undefined, "advantage|disadvantage", `^saving-throws|^${save_subType}`).forEach(mod => {
            // console.log("save:", mod.source, mod.type, mod.subType, mod.value);
            save.adjustment = mod.type;
            if (mod.detail.restriction) {
                save.restriction = mod.detail.restriction;
            }
        });
        saves[stat.key] = save;
        // console.dir(save, {breakLength: 160});
    });
    return saves;
}

function getDefenses(c_json, character, modifiers) {
    let defenses = {
        "resistance": [],
        "immunity": [],
        "vulnerability": [],
    }
    for (let defenseType in defenses) {
        filterModifiers(modifiers, undefined, defenseType).forEach(mod => {
            // console.dir(mod, { breakLength: 120 });
            defenses[defenseType].push(mod.detail.friendlySubtypeName);
        });
    };

    c_json.customDefenseAdjustments.forEach(adjustment => {
        // console.log(adjustment.adjustmentId)
        let damage = rules.damageAdjustments.find((damageRule) => {
            if (damageRule.id == adjustment.adjustmentId) {
                return true;
            }
        });
        // console.log(damage);
        switch (damage.type) {
            case 1:
                defenses.resistance.push(damage.name + "*");
                break;
            case 2:
                defenses.immunity.push(damage.name + "*");
                break;
            case 3:
                defenses.vulnerability.push(damage.name + "*");
                break;
        }
    });
    for (let defenseType in defenses) {
        defenses[defenseType].sort();
    };

    return defenses;
}

function filterModifiers(modifiers, modifier_source, modifier_type, modifier_subtype) {
    let source_regex = /.*/;
    if (typeof (modifier_source) != "RegExp") {
        source_regex = new RegExp(modifier_source)
    }
    let type_regex = /.*/;
    if (typeof (modifier_type) != "RegExp") {
        type_regex = new RegExp(modifier_type)
    }
    let subtype_regex = /.*/;
    if (typeof (modifier_subtype) != "RegExp") {
        subtype_regex = new RegExp(modifier_subtype)
    }
    let filtered = modifiers.filter(modifier => {
        if (
            source_regex.test(modifier.source) &&
            type_regex.test(modifier.type) &&
            subtype_regex.test(modifier.subType)
        ) {
            return true;
        }
    });
    return filtered;
}

function modifierSubtypes(modifier_type, modifiers, friendly) {
    let subTypeKey = "subType";
    if (friendly === true) {
        subTypeKey = "friendlySubtypeName";
    }
    let subTypes = new Set()
    modifiers.forEach(mod => {
        if (mod.type == modifier_type) {
            let subType = mod.detail[subTypeKey].toLowerCase();
            if (subType != "choose a language") {
                subTypes.add(subType);
            };
        }
    });
    return Array.from(subTypes);
}

function ruleStatForID(stat_id) {
    let r_stat = rules.stats.find((stat_search_item) => {
        if (stat_search_item.id == stat_id) {
            return true;
        }
    });
    return r_stat;
}

function parseCharacter(c_json) {
    // console.log(`\n#### Parsing ${c_json.name.padEnd(20)} https://www.dndbeyond.com/profile/${c_json.userId}/characters/${c_json.id} ####`);
    let character = {
        id: c_json.id,
        userId: c_json.userId,
        readonlyUrl: c_json.readonlyUrl,
        name: c_json.name,
        level: characterLevel(c_json),
        race: c_json.race.fullName,
        class: "",
        url: `https://www.dndbeyond.com/profile/${c_json.userId}/characters/${c_json.id}`, // full r/w URL
        avatarUrl: "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png",
        lastUpdate: Date.now(),
        characterLevel: characterLevel(c_json),
        levelProficiencyBonus: levelProficiencyBonuses(characterLevel(c_json)),
    }

    if (c_json.decorations.avatarUrl) {
        let url_matches = c_json.decorations.avatarUrl.match(/(https.*)\?/);
        if (url_matches && url_matches.length >= 1) {
            character.avatarUrl = url_matches[1];
        }
    }

    // TODO: untested with multiclass, may need to sort?
    c_json.classes.forEach(c_class => {
        if (character.class.length) {
            character.class += " / ";
        }
        character.class += `${c_class.definition.name} ${c_class.level}`
    });

    // Array of modifiers from race/class/items/etc
    let modifiers = getModifiers(c_json);

    // Primary stats eg: str/dex/etc
    character.stats = {};
    Object.values(c_json.stats).forEach(c_stat => {
        let r_stat = ruleStatForID(c_stat.id);
        let stat_key = r_stat.key.toLowerCase();
        let stat_name = r_stat.name;
        let stat_value = calculateStat(c_json, character, modifiers, stat_name + "-score", c_stat.value);
        character.stats[stat_key] = {
            key: stat_key,
            name: stat_name,
            value: stat_value,
            modifier: statModifer(stat_value)
        };
    });

    // Saves
    character.saves = getSaves(c_json, character, modifiers);

    // Defenses
    character.defenses = getDefenses(c_json, character, modifiers);

    // Conditions
    character.conditions = [];
    Object.values(c_json.conditions).forEach(c_condition => {
        let condition = rules.conditions.find((r_condition) => {
            if (r_condition.definition.id == c_condition.id) {
                return true;
            }
        });
        character.conditions.push(condition.definition.name);
    });
    character.conditions.sort();

    // HP, I'm currently ignoring overrideHitPoints
    let hp_per_level = character.stats["con"].modifier;
    filterModifiers(modifiers, undefined, undefined, "hit-points-per-level").forEach(mod => {
        hp_per_level += mod.value;
    });
    let max_hp = c_json.baseHitPoints + (hp_per_level * character.characterLevel);
    let current_hp = max_hp - c_json.removedHitPoints;
    character.health = {
        hp_current: current_hp,
        hp_max: max_hp,
        hp_temp: c_json.temporaryHitPoints,
    };

    // AC and other core stats
    character.spells = getSpells(c_json);
    character.armor = getArmor(c_json, character, modifiers)
    let base_ac = character.armor.finalArmorClass;
    let walk_speed = calculateStat(c_json, character, modifiers, "speed", (c_json.race.weightSpeeds.normal.walk));
    let movement_bonus = calculateStat(c_json, character, modifiers, "unarmored-movement", 0);
    character.core = {
        ac: calculateStat(c_json, character, modifiers, "armor-class", base_ac),
        initiative: calculateStat(c_json, character, modifiers, "initiative", (character.stats["dex"].modifier)),
        speed: walk_speed + movement_bonus,
        languages: modifierSubtypes("language", modifiers, true).sort(),
    }
    character.skills = getSkills(c_json, character, modifiers);
    character.passives = {
        perception: 10 + character.skills.perception.modifier,
        investigation: 10 + character.skills.investigation.modifier,
        insight: 10 + character.skills.insight.modifier,
    }
    return character;
}


function deep_compare(a, b) {
    var logs = [];

    function log(log, path) {
        if (path) {
            logs.push(log + ' (path: ' + path + ').');
        } else {
            logs.push(log + '.');
        }
    }

    function analyse(a, b, path) {
        if (a === b) {
            return;
        }
        if ((typeof (a) == "string") && ((typeof (b) == "string"))) {
            if (a.toLowerCase() == b.toLowerCase()) {
                return;
            }
        }
        if ((a instanceof Object) && (b instanceof Object)) {
            if (a.constructor !== b.constructor) {
                log('Entities do not have same constructors', path);
                return;
            }

            for (const key in a) {
                if (key == "restriction") {
                    return
                }
                if (a.hasOwnProperty(key)) {
                    if (!b.hasOwnProperty(key)) {
                        log('Property "' + key + '" does not exist in first entity', path);
                        continue;
                    }
                    analyse(a[key], b[key], path ? path + ' -> ' + key : key);
                }
            }
            for (const key in b) {
                if (key == "restriction") {
                    return
                }
                if (b.hasOwnProperty(key) && !a.hasOwnProperty(key)) {
                    log('Property "' + key + '" does not exist in second entity', path);
                }
            }
        } else {
            log('Entities are not equal', path);
        }
    }
    analyse(a, b, '');
    return logs;
}

function compareCharacterJSON(c_dom, c_api) {
    // console.log("Character via DOM:", c_dom);
    // console.log("Character via API:", c_api);
    let equal_flag = true;
    let characterProperties = [
        "avatarUrl",
        // "characterLevel",
        "class",
        "id",
        "race",
        // "url",  // These will be different, but working. Built from the API it will have userid, DOM will have username
        "core",
        "stats",
        "skills",
        "health",
        "conditions",
        "defenses",
        "saves",
        "passives"
    ];
    characterProperties.forEach(property_name => {
        if (property_name == "passives") {
            // patch to match the current dom scrape
            c_dom.passives.perception = parseInt(c_dom.passives.perception);
            c_dom.passives.investigation = parseInt(c_dom.passives.investigation);
            c_dom.passives.insight = parseInt(c_dom.passives.insight);
            delete c_dom.passives.senses;
        }
        if (property_name == "saves") {
            Object.values(c_dom.saves).forEach(dom_save => {
                dom_save.key = dom_save.name;
                dom_save.name = c_api.stats[dom_save.key].name;
                dom_save.adjustment = c_api.saves[dom_save.key].adjustment
                dom_save.restriction = c_api.saves[dom_save.key].restriction;
            });
        }

        let diff = deep_compare(c_dom[property_name], c_api[property_name]);
        if (diff.length) {
            equal_flag = false;
            // console.log(`c_dom[${property_name}]: `,
            //     util.inspect(c_dom[property_name], { breakLength: 120, colors: true }));
            // console.log(`c_api[${property_name}]: `,
            //     util.inspect(c_api[property_name], { breakLength: 120, colors: true }));
            console.log(`${property_name}:`, diff);
        }
    });
    return equal_flag;
}

module.exports = {
    parseCharacter,
    compareCharacterJSON
};