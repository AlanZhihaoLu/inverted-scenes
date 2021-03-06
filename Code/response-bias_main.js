var timeline = [];

// var test_stimuli = jsPsych.randomization.repeat(raw_stimuli, 1);

var test_stimuli = raw_stimuli;

for (i = 0; i < attention_checks.length; i++) {
  test_stimuli.splice(6+(13*i), 0, attention_checks[i])
}

var welcome = {
    type: "html-keyboard-response",
    stimulus: "<h3>Welcome to the experiment!</h3>" + 
    "<p>We thank you for your participation.</p>" +
    "<p><em>Press any key to start.</em></p>",
    data: {
        on_screen: 'welcome'
    }
};
timeline.push(welcome);

var introduction = {
    type: "html-keyboard-response",
    stimulus: "<p>In this experiment, you will be answering questions on briefly presented scene images.</p>" +
    "<p>First, let's first run through an example practice trial.</p>" +
    "<p><em>Press any key to continue.</em></p>",
    data: {
        on_screen: 'introduction'
    }
}
timeline.push(introduction);

var instr_fixation = {
    type: 'html-keyboard-response',
    stimulus: "<p>(1) First, you will see a fixation cross, which looks like this:</p>" +
    '<div style="font-size:60px;">+</div>' + 
    "<p>Please keep your eyes on it while it's there!</p>" +
    '<p><em>Press "3" to continue.</em></p>',
    choices: ['3'],
    data: {
        on_screen: 'instr_fixation'
    }
}
var instr_scene_image = {
    type: "html-keyboard-response",
    stimulus: function(){
    var inverted = (jsPsych.timelineVariable('Inverted', true) === "Yes") ? 'style="transform: scaleY(-1);"' : '';
    var scene_image = jsPsych.timelineVariable('SceneImage', true);
    var html = '<p>(2) Next, a scene image will briefly appear in the center of the screen, like this one.</p>' +
        '<img ' + inverted + ' src="https://alanzhihaolu.github.io/inverted-scenes/Images/test_stimuli/' + 
        scene_image + 
        '" alt="' + 
        scene_image + 
        '" width="500" height=auto>' +
        '<p><em>Press "5" to continue.</em></p>'
    return html
    },
    choices: ['5'],
    data: {on_screen: 'instr_scene_image', 
        SceneImage: jsPsych.timelineVariable('SceneImage')
    }
}
var instr_scene_image_inverted = {
    type: "html-keyboard-response",
    stimulus: function(){
    var scene_image = jsPsych.timelineVariable('SceneImage', true);
    var html = '<p>(2, continued) They will also sometimes appear upside-down, like this:</p>' +
        '<img style="transform: scaleY(-1);" src="https://alanzhihaolu.github.io/inverted-scenes/Images/test_stimuli/' + 
        scene_image + 
        '" alt="' + 
        scene_image + 
        '" width="500" height=auto>' +
        '<p><em>Press "8" to continue.</em></p>'
    return html
    },
    choices: ['8'],
    data: {
        on_screen: 'instr_scene_image_inverted', 
        SceneImage: jsPsych.timelineVariable('SceneImage')
    }
}
var instr_mask = {
    type: "html-keyboard-response",
    stimulus: '<p>(3) After that, you will see a noisy "pattern" flash on the screen, like this:</p>' + 
        `<img src="https://alanzhihaolu.github.io/inverted-scenes/Images/noise_mask/NoiseMask.jpg" alt="Noise Mask" width="500" height=auto>` +
        '<p><em>Press "9" to continue.</em></p>',
    choices: ['9'],
    data: {
        on_screen: 'instr_mask'
    }
}
var instr_question = {
    type: 'html-keyboard-response',
    stimulus: function(){
        var html = "<p>(4) Finally, a word describing an object will appear on the screen. In this case, the word is <b>" + jsPsych.timelineVariable('probe', true) + "</b>.<br>" +
        "Please use your keyboard to answer whether the object was present in the scene image shown in (2).<br>" + 
        'If you think the object was present in the scene image, press "1".<br>' +
        'Otherwise, if you think the object was not present in the scene image, press "2".<br>' +
        "Don't worry if you aren't able to tell for sure! Just make your best guess.</p><br>" +
        '<h1>' + jsPsych.timelineVariable('probe', true) + '</h1><br><br>' +
        '<h3>"yes" or "no"<br>1 &nbsp; &nbsp; or &nbsp; &nbsp;2</h3><br><br>' +
        '<p><em>Press "1" or "2" to continue.</em></p>'
        return html
    },
    choices: ['1', '2'],
    data: {
        on_screen: 'instr_question', 
        probe: jsPsych.timelineVariable('probe')
    }
}
var instr_end = {
    type: "html-keyboard-response",
    stimulus: "<p>Great!</p>" +
    "<p>Now let's see what it looks like all put together!</p>" +
    '<p><em>Press any key to continue.</em></p>',
    data: {
        on_screen: 'instr_end'
    }
};
var instructions = {
    timeline: [instr_fixation, instr_scene_image, instr_scene_image_inverted, instr_mask, instr_question, instr_end],
    timeline_variables: practice_stimuli
}
timeline.push(instructions);

var fixation = {
    type: 'html-keyboard-response',
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: jsPsych.NO_KEYS,
    trial_duration: 2000,
    data: function(){
        return ({
            on_screen: 'fixation',
            practice: (jsPsych.timelineVariable('practice',true)==="Yes")?'Yes':'No',
            exp_stage: (jsPsych.timelineVariable('practice',true)==="Yes")?'practice_trial_fixation':'main_trial_fixation'
        })
    }
}
var scene_image = {
    type: "html-keyboard-response",
    stimulus: function(){
    var inverted = (jsPsych.timelineVariable('Inverted', true) === "Yes") ? 'style="transform: scaleY(-1);"' : '';
    var scene_image = jsPsych.timelineVariable('SceneImage', true)
    var html = '<img ' + inverted + ' src="https://alanzhihaolu.github.io/inverted-scenes/Images/test_stimuli/' + 
        scene_image + 
        '" alt="' + 
        scene_image + 
        '" width="500" height=auto>'
    return html
    },
    choices: jsPsych.NO_KEYS,
    trial_duration: jsPsych.timelineVariable('Duration'),
    data: function(){
        return ({
          on_screen: 'scene_image',
          practice: (jsPsych.timelineVariable('practice',true)==="Yes")?'Yes':'No',
          exp_stage: (jsPsych.timelineVariable('practice',true)==="Yes")?'practice_trial_scene_image':'main_trial_scene_image',
          SceneImage: jsPsych.timelineVariable('SceneImage'),
          probe: jsPsych.timelineVariable('probe'),
          Inverted: jsPsych.timelineVariable('Inverted'),
          Consistent: jsPsych.timelineVariable('Consistent'),
          Duration: jsPsych.timelineVariable('Duration')
        })
    }
}
var mask = {
    type: "html-keyboard-response",
    stimulus: `<img src="https://alanzhihaolu.github.io/inverted-scenes/Images/noise_mask/NoiseMask.jpg" alt="Noise Mask" width="500" height=auto>`,
    choices: jsPsych.NO_KEYS,
    trial_duration: 50,
    data: function(){
        return ({
          on_screen: 'mask',
          practice: (jsPsych.timelineVariable('practice',true)==="Yes")?'Yes':'No',
          exp_stage: (jsPsych.timelineVariable('practice',true)==="Yes")?'practice_trial_mask':'main_trial_mask'
        })
    }
}
var question = {
    type: 'html-keyboard-response',
    stimulus: function(){
        var html = '<br><br><h1>' + jsPsych.timelineVariable('probe', true) + '</h1><br><br>' +
        '<h3>"yes" or "no"<br>1 &nbsp; &nbsp; or &nbsp; &nbsp;2</h3><br><br>'
        return html
    },
    choices: ['1', '2'],
    data: function(){
        return ({
          on_screen: 'question',
          practice: (jsPsych.timelineVariable('practice',true)==="Yes")?'Yes':'No',
          exp_stage: (jsPsych.timelineVariable('practice',true)==="Yes")?'practice_trial_question':'main_trial_question',
          SceneImage: jsPsych.timelineVariable('SceneImage'),
          probe: jsPsych.timelineVariable('probe'),
          Inverted: jsPsych.timelineVariable('Inverted'),
          Consistent: jsPsych.timelineVariable('Consistent'),
          Duration: jsPsych.timelineVariable('Duration')
        })
    },
    on_finish: function(data){
        data.response = (jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(data.key_press)==="1")?"Yes":"No";
        fetch('https://inverted-scenes-rb01.herokuapp.com/rb01')
        .then(response=>response.json())
        .then(resp=>console.log(resp))
    }
}
var example_trial = {
    timeline: [fixation, scene_image, mask, question],
    timeline_variables: practice_stimuli
}
timeline.push(example_trial);

var practice_end = {
    type: "html-keyboard-response",
    stimulus: "<p>How was that? As you can see, each trial is pretty short.</p>" +
    "<p>In the main experiment, the next trial will start automatically as soon as you enter your response.</p>" +
    "<p>Try not to lose focus, and please answer quickly and as accurately as possible throughout the experiment.</p>" +
    "<p>Please note that, although speed is valued, <b>accuracy is most important.</b></p>" +
    '<p><em>Press "7" to acknowledge this message and continue to the main experiment.</em></p>',
    choices: ['7'],
    data: {
        on_screen: 'practice_end'
    }
}
timeline.push(practice_end);

var start_note = {
    type: "html-keyboard-response",
    stimulus: "<p>We will now begin the experiment.</p>" +
    "<p>Remember to be as accurate as possible with your responses.</p>" + 
    '<p><em>Press "1" to start the main experiment.</em></p>',
    choices: ['1'],
    data: {
        on_screen: 'start_note'
    }
}
timeline.push(start_note);

var procedure = {
    timeline: [fixation, scene_image, mask, question],
    timeline_variables: test_stimuli
}
timeline.push(procedure);

var end_note = {
    type: "html-keyboard-response",
    stimulus: "<p><b>DO NOT EXIT THE EXPERIMENT.<br>" +
    "Please wait - the experiment will continue in 10 seconds.</b></p>",
    choices: jsPsych.NO_KEYS,
    trial_duration: 10000,
    data: {
        on_screen: 'end_note'
    },
    on_start: function(){
        fetch('https://inverted-scenes-rb01.herokuapp.com/rb01')
        .then(response=>response.json())
        .then(resp=>console.log(resp))
    }
}
timeline.push(end_note);

var images = ['https://alanzhihaolu.github.io/inverted-scenes/Images/noise_mask/NoiseMask.jpg', 
"https://alanzhihaolu.github.io/inverted-scenes/Images/test_stimuli/coffeemaker.jpg",
test_stimuli.map(a => `https://alanzhihaolu.github.io/inverted-scenes/Images/test_stimuli/${a.SceneImage}`)]

function save_data_json() {
    data = jsPsych.data.get().filter({practice: "No"}).json();
    fetch('https://inverted-scenes-rb01.herokuapp.com/rb01', { 
        method: 'post',
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({ 
          exp_data: data
        })
    })
  }