var timeline = [];

var welcome = {
    type: "html-keyboard-response",
    stimulus: "<h3>Welcome to the experiment!</h3>" + 
    "<p>We thank you for your participation.</p>" +
    "<p><em>Press any key to start.</em></p>",
    data: {component: 'welcome'}
};
timeline.push(welcome);

var introduction = {
    type: "html-keyboard-response",
    stimulus: "<p>In this experiment, you will be answering questions on briefly presented scene images.</p>" +
    "<p>First, let's first run through an example practice trial.</p>" +
    "<p><em>Press any key to continue.</em></p>",
    data: {component: 'introduction'}
}
timeline.push(introduction);

var instr_fixation = {
    type: 'html-keyboard-response',
    stimulus: "<p>(1) First, you will see a fixation cross, which looks like this:</p>" +
    '<div style="font-size:60px;">+</div>' + 
    "<p>Please keep your eyes on it while it's there!</p>" +
    '<p><em>Press any key to continue.</em></p>',
    data: {component: 'instr_fixation'}
}
var instr_scene_image = {
    type: "html-keyboard-response",
    stimulus: function(){
    var inverted = (jsPsych.timelineVariable('Inverted', true) === "Yes") ? 'style="transform: scaleY(-1);"' : '';
    var scene_image = jsPsych.timelineVariable('SceneImage', true);
    var html = '<p>(2) Next, a scene image will briefly appear in the center of the screen, like this one.</p>' +
        '<img ' + inverted + ' src="https://alanzhihaolu.github.io/inverted-scenes/Images/SceneImages/' + 
        scene_image + 
        '" alt="' + 
        scene_image + 
        '" width="500" height=auto>' +
        '<p><em>Press any key to continue.</em></p>'
    return html
    },
    data: {component: 'instr_scene_image', SceneImage: jsPsych.timelineVariable('SceneImage')}
}
var instr_scene_image_inverted = {
    type: "html-keyboard-response",
    stimulus: function(){
    var scene_image = jsPsych.timelineVariable('SceneImage', true);
    var html = '<p>(2, continued) They will also sometimes appear upside-down, like this:</p>' +
        '<img style="transform: scaleY(-1);" src="https://alanzhihaolu.github.io/inverted-scenes/Images/SceneImages/' + 
        scene_image + 
        '" alt="' + 
        scene_image + 
        '" width="500" height=auto>' +
        '<p><em>Press any key to continue.</em></p>'
    return html
    },
    data: {component: 'instr_scene_image_inverted', SceneImage: jsPsych.timelineVariable('SceneImage')}
}
var instr_mask = {
    type: "html-keyboard-response",
    stimulus: '<p>(3) After that, you will see a noisy "pattern" flash on the screen, like this:</p>' + 
        `<img src="https://alanzhihaolu.github.io/inverted-scenes/Images/NoiseMask/NoiseMask.png" alt="Noise Mask" width="500" height="375">` +
        '<p><em>Press any key to continue.</em></p>',
    data: {component: 'instr_mask'}
}
var instr_question = {
    type: 'html-keyboard-response',
    stimulus: function(){
        var html = "<p>(4) Finally, a word describing an object will appear on the screen. In this case, the word is <b>" + jsPsych.timelineVariable('Object', true) + "</b>.<br>" +
        "Please use your keyboard to answer whether the object was present in the scene image shown in (2).<br>" + 
        'If you think the object was present in the scene image, press "1".<br>' +
        'Otherwise, if you think the object was not present in the scene image, press "2".<br>' +
        "Don't worry if you aren't able to tell for sure! Just make your best guess.</p><br>" +
        '<h1>' + jsPsych.timelineVariable('Object', true) + '</h1><br><br>' +
        '<h3>"yes" or "no"<br>1 &nbsp; &nbsp; or &nbsp; &nbsp;2</h3><br><br>' +
        '<p><em>Press "1" or "2" to continue.</em></p>'
        return html
    },
    choices: ['1', '2'],
    data: {component: 'instr_question', Object: jsPsych.timelineVariable('Object')}
}
var instr_end = {
    type: "html-keyboard-response",
    stimulus: "<p>Great!</p>" +
    "<p>Now let's see what it looks like all put together!</p>" +
    '<p><em>Press any key to continue.</em></p>',
    data: {component: 'instr_end'}
};
var instructions = {
    timeline: [instr_fixation, instr_scene_image, instr_scene_image_inverted, instr_mask, instr_question, instr_end],
    timeline_variables: [{SceneImage: "basketball_net.jpg", Object: "Microwave", Inverted: "No", Consistent: "Yes"}]
}
timeline.push(instructions);

var fixation = {
    type: 'html-keyboard-response',
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: jsPsych.NO_KEYS,
    trial_duration: 2000,
    data: {component: 'fixation'}
}
var scene_image = {
    type: "html-keyboard-response",
    stimulus: function(){
    var inverted = (jsPsych.timelineVariable('Inverted', true) === "Yes") ? 'style="transform: scaleY(-1);"' : '';
    var scene_image = jsPsych.timelineVariable('SceneImage', true)
    var html = '<img ' + inverted + ' src="https://alanzhihaolu.github.io/inverted-scenes/Images/SceneImages/' + 
        scene_image + 
        '" alt="' + 
        scene_image + 
        '" width="500" height=auto>'
    return html
    },
    choices: jsPsych.NO_KEYS,
    trial_duration: function(){
    return jsPsych.randomization.sampleWithoutReplacement([25, 40, 50, 60, 80, 100, 150], 1)[0];
    },
    data: {
        component: 'scene_image',
        SceneImage: jsPsych.timelineVariable('SceneImage'),
        Object: jsPsych.timelineVariable('Object'),
        Inverted: jsPsych.timelineVariable('Inverted'),
        Consistent: jsPsych.timelineVariable('Consistent')
    }
}
var mask = {
    type: "html-keyboard-response",
    stimulus: `<img src="https://alanzhihaolu.github.io/inverted-scenes/Images/NoiseMask/NoiseMask.png" alt="Noise Mask" width="500" height="375">`,
    choices: jsPsych.NO_KEYS,
    trial_duration: 50,
    data: {component: 'mask'}
}
var question = {
    type: 'html-keyboard-response',
    stimulus: function(){
        var html = '<br><br><h1>' + jsPsych.timelineVariable('Object', true) + '</h1><br><br>' +
        '<h3>"yes" or "no"<br>1 &nbsp; &nbsp; or &nbsp; &nbsp;2</h3><br><br>'
        return html
    },
    choices: ['1', '2'],
    data: {
        component: 'question',
        SceneImage: jsPsych.timelineVariable('SceneImage'),
        Object: jsPsych.timelineVariable('Object'),
        Inverted: jsPsych.timelineVariable('Inverted'),
        Consistent: jsPsych.timelineVariable('Consistent')
    },
    on_finish: function(data){
        data.response = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(data.key_press)
    }
}
var example_trial = {
    timeline: [fixation, scene_image, mask, question],
    timeline_variables: [{SceneImage: "basketball_net.jpg", Object: "Microwave", Inverted: "No", Consistent: "Yes"}]
}
timeline.push(example_trial);

var practice_end = {
    type: "html-keyboard-response",
    stimulus: "<p>How was that?</p>" +
    "<p>As you can see, each trial is pretty short.</p>" +
    "<p>Try not to lose focus, and answer as best as you can throughout the experiment.</p>" +
    '<p><em>Press any key to continue.</em></p>',
    data: {component: 'practice_end'}
}
timeline.push(practice_end);

var start_note = {
    type: "html-keyboard-response",
    stimulus: "<p>We will now begin the experiment.</p>" + "<p><em>Press any key to start.</em></p>",
    data: {component: 'start_note'}
}
timeline.push(start_note);

var procedure = {
    timeline: [fixation, scene_image, mask, question],
    timeline_variables: test_stimuli
}
timeline.push(procedure);

var end_note = {
    type: "html-keyboard-response",
    stimulus: "<p>You have completed the experiment. Thank you!</p>",
    data: {component: 'end_note'}
}
timeline.push(end_note);

var images = ['https://alanzhihaolu.github.io/inverted-scenes/Images/NoiseMask/NoiseMask.png', 
"https://alanzhihaolu.github.io/inverted-scenes/Images/SceneImages/basketball_net.jpg",
test_stimuli.map(a => `https://alanzhihaolu.github.io/inverted-scenes/Images/SceneImages/${a.SceneImage}`)]