/**
 * jwc IMPORTANT NOTES
 * 
 * jwc 25-0210-1400 * network_DataPacket_Rcvd_FieldNames_ArrayListOfText = ["#", "L", "M"]
 * 
 * * network_DataPacket_Rcvd_FieldNames_ArrayListOfText = ["A", "L", "R"]
 * 
 * * network_DataPacket_Rcvd_FieldNames_Login_ArrayListOfText = ["Z", "L", "R"]
 */
// Very-Key Notes:
// 
// ----- ----- ----- ----- ----- ----- ----- -----
// 
// * Key Notes: Bot (Network: Server)
// 
// * DfRobot Driver Expansion Board
// 
// ** https://wiki.dfrobot.com/Micro_bit_Driver_Expansion_Board_SKU_DFR0548
// 
// ** https://github.com/DFRobot/pxt-motor
// 
// * Micro-Servo 9G A0090 (Sparkfun)
// 
// ** ~ HiTec HS-55
// 
// ** MicroBit: 'servo set pulse pin Px (e.g. P8) to (us) ___'  :)+
// 
// * To prevent flooding this bot-server with messages, have controller-client delay approx. 20ms to still maintain real-time response after each send-tx.
// 
// * Also, 1 Char Msg Max, 2 Char or more caused buffer-overrun and serial broke down, froze
// 
// * on event AB not work, but A or B does work reliably
// 
// * also 'on button A', 'on button B', and 'on button A+B' do work without 'on event' blocks present: event triggers only on ButtonEvtUp reliably
// 
// ** Also if held down longer than 2 sec, event will be aborted
// 
// * Thus, avoid condition: 'button A/B/A+B is pressed' block since not reliable
// 
// ----- ----- ----- ----- ----- ----- ----- -----
// 
// * Key Notes: Controller-Joystick (Network-Client)
// 
// * Yahboom Joystick
// 
// ** https://www.yahboom.net/study/SGH
// 
// ** https://github.com/lzty634158/GHBit
// 
// * DfRobot Driver Expansion Board
// 
// ** https://wiki.dfrobot.com/Micro_bit_Driver_Expansion_Board_SKU_DFR0548
// 
// ** https://github.com/DFRobot/pxt-motor
// 
// ----- ----- ----- ----- ----- ----- ----- -----
// 
// ----- ----- ----- ----- ----- ----- ----- -----
// 
// * 2nd level of conditions not reliable involving 'name', 'value' and 'button press'
// 
// * Prevent Boundary Issues with Rollover/FlipMSB, Thus Force Largest-Boundaried-Tilt, etc.: Constrain Raw Tilts: -90,+90 or -60,+60
// 
// * Disable code (pulling out of stack) is same as removing code and is effective for redeeming used disk/ram space
// 
// * Deadzone was 20, yet do 30 for safety buffer
// 
// * button_Debounce_TriggerDisableMsec: 'Pause appears to solve timing issue of multiple tx where gears are skipped, thus slow down tx: 100ms too fast - not help, 200ms best, 500ms better, 1s, 2s good
// 
// * Do not allow 'on shake/freefall/any_motion_event' for Bot since collision can accidentally trigger this
// 
// * MicroBit A/B Buttons not work well with LED Display, so use 'show string' instead
// 
// * Test Responsiveness-RealTime via Rocking-Joystick-BackAndForth-BothExtremes
// 
// ** 20msec :) not bad-but some lag, 50msec :) seems just right, 100msec not bad-but some lag
// 
// ** network_Throttle_PausePerCpuCycle_Int = 50
// 
// ** Both Bot and Controller appears automatically balanced at 40msec/cpu_cycle
// 
// 2021-0307
// 
// * Round does work, yet for Quadrant 2, 4, opposite polarity causes X.Y Pair not work, since will not sum correctly, thus must offset with 255 for all positive message-transfer
// 
// * false = 0, true > 0 (non-zero)
// 
// 2021-0308-0900
// 
// * Seems Javascript more robust debugger:error-finder vs. Python
// 
// * Makecode: only changes honored on the latest web-version in case duplicate window
// 
// 2021-0311
// 
// * Weird compass rotation is skewed moving forward and backward in a cyclical way, does distort the number. Stationary okay, but added motion not good.  Wheels don't need to move.
// 
// 2021-0313
// 
// * P16 and P8 are the only pins not reserved for anything else, thus free for Servo 1 &  2
// 
// ** yet P8 hard to find, so use p15 instead
// 
// ** https://makecode.microbit.org/device/pins
// 
// * Seems that servos are reversed orientation.  Look from outside observer, not driver-perspective
// 
// * Seems that  Lego Servos are 270-degrees range (vs180)
// 
// 22-1126
// 
// * Seems best that switch to true 'Bool' type vs 'Bool_Int' though more convenient for 'serial_prints', not good for customized api_blocks
// 
// 22-1217
// 
// * Delauren Total-Quad-Arm Lift: 3 x AA = 3 x 24g/AA = 75 g
// 
// ** 100 g too much
// 
// ** LEGO Technic Weight Block 50g
// 
// 22-1218
// 
// * TYJ used Medium 2KG-Torque Twin Motors can lift 200g w/o much strain, 250g with straining. Direct axle shaft best for max torque.  Avoid Dog-Gear for Max Torque.  These motors stop being strong enough to cut/break/severe/pinch off your finger.  ; )
function screen_Show_Command_Func (screen_X_In: number, screen_Y_In: number) {
    led.plotBrightness(screen_X_In, screen_Y_In, screenBrightness_Hi_DEFAULT_INT)
    // too long: 50ms, 100ms, 500ms
    basic.pause(20)
    led.unplot(screen_X_In, screen_Y_In)
    screen_Show_DiagnosticDashboard_Func()
}
function screen_Show_DiagnosticDashboard_Func () {
    screen_Clear_Fn(4, 4)
    doGroupChannelShow_Func()
}
// Key Notes
// 
// * 2020-0120: 844 SW error : GC allocation failed for requested number bytes: GC (garbage collection) error of 57 variables max,
// 
// * 2020-0120-02: Arm Servo
// 
// ** S-bus not work (DFRobot driver), so switch to P-bus (MakeCode driver)
// 
// ** DfRobot only has P0, P1, P2 as Read/Write from MakeCode's Menu, so reserve for Read Only.  Rest for Write Only.
// 
// *** Ultrasonic Sensor: P0 (Read, Echo), P8 (Write, Trigger)
// 
// *** ServoArmRight: P12 (Write-Only)
// 
// *** PIxyCam: P13 (Write-Only) Pan Servo, P14 (Write-Only) Tilt Servo, P1 (Read) Dig In from PixyCam-P1, P2 (Read) Ana In from PIxyCam-P8, S8-Pwr, S8-Gnd
// 
// * 2020-0305
// 
// ** 844 Error 57,49 variable max issue: Consolidate 'index_X' 'index_Y' to 'index'
// 
// * 2020-0328
// 
// ** DFRobot S1 not seem to work for Arm-Right, though worked before, go back to micro:bit P16
// 
// ** abandon usage of S1-S6 for now, not reliable, since not work before, yet TYJ P1-P16 does  :)+
// 
// * 2020-04xx
// 
// * Micro-Servo 9G A0090 (Sparkfun)
// 
// * HiTec HS-55
// 
// * MicroBit: 'servo set pulse pin Px (e.g. P8) to (us) ___'  :)+
// 
// * Using DFRobot Servo Pins not reliable, possibly since these are 3.3.v servos (not standard 5.0v servos), thus use MicroBit 'servo write pin Pxx' blocks for reliable 0-180 degrees.
// 
// 2021-0228
// 
// * DC Motors
// 
// ** \ e.g. 155, 205, 255 (which is close enough to 255 during testing); delta 50
// 
// ** 70% of 255 = 178.5 = 180 rounded-up; also (155+205)/2 = 180
// 
// ** Stick w/ 155 (vs 180) for most significant difference vs Gear 2
// 
// * KEY BUG: 'round' not seems to work, thus do manually
// 
// * Button 'Release' Not Reliable, Seems Buggy
// 
// * Use Digital-Pin as a DIP Switch for Setup
// 
// ** Use P16 since easiest to locate (at top) for quick change
// 
// ** For Controller-Joystick: Yahboom: Appears P16 defaults to Low when Open-Circuit
// 
// ** Remove P16-Dependency since unreliable open-circuit value: either 0 or 1
// 
// * Tried 10, but maybe not enough granularity, assuming have new, same-aged dc-motors.
// 
// ** Resume back to 5 (smallest significant)
// 
// ** Even need more, then recommend replacing hardware: new pair of dc-motors.
// 
// 2021-0301
// 
// * For Critical Configs, Best to send absolute value ('on radio received name value') vs relative values (on radio received 'receivedString'), for robustness vs. dropped packets
// 
// ** This software config should be for small fine-tuning
// 
// * Tilt (/Rotation/Accelerometer) = 't_*' (Prefix-Header For Radio Messages)
// 
// ** WARNING: Seems like First condition ok when along, but when 2nd added, 1st is ignored. Thus 2-Level Logic Not Reliable
// 
// ** Original Motor0to255:(255,-255) -> (510,0) Add 255 here: Keep all positive since cannot radio two negative #, subtract 255 at destination
// 
// * Deactivate 'calibrate compass' since will force calibrate each new run of this code, which would be too much and inconvenient.  By default, calibrate occurs upon each flash, which is sufficient.
// 
// * Test Responsiveness-RealTime via Rocking-Joystick-BackAndForth-BothExtremes
// 
// * Both Bot and Controller appears automatically balanced at 40msec/cpu_cycle
// 
// ** As long avoid 400 msec consuming LED-displays
// 
// ** Thus keep at 0 msec
// 
// * Sonar
// 
// ** Standard/Default can be overridden by Master-Server
// 
// ** 15, 30, 45
// 
// 2021-0309
// 
// * 'serial write value 'name'='value'' uses ':' vs '='
// 
// 2021-0311
// 
// * Calibration: Swirl Around Like Panning for Gold, Moving Marble Around on Flat-Plane
function setup_Network_Fn () {
    if (true) {
        // Only 20 Leds Available
        network_GroupChannel_MyBotAndController_BASE0_MAX_INT = 25
        // Only 20 Leds Available
        network_GroupChannel_MyBotAndController_BASE0_MIN_INT = 1
        radio.setGroup(network_GroupChannel_MyBotAndController_Base0_Int)
        if (true) {
            network_GroupChannel_MyBotAndController_Digit_Hundreds_Int = Math.idiv(network_GroupChannel_MyBotAndController_Base0_Int, 100) % 10
            network_GroupChannel_MyBotAndController_Digit_Tens_Int = Math.idiv(network_GroupChannel_MyBotAndController_Base0_Int, 10) % 10
            network_GroupChannel_MyBotAndController_Digit_Ones_Int = Math.idiv(network_GroupChannel_MyBotAndController_Base0_Int, 1) % 10
        }
        if (true) {
            // * 3 sec  TOO SLOW? >> try 2 >> try 1 WILL CAUSE TOO MUCH NETWORK OVERHEAD
            network_HiMessage_Frequency_SEC_INT = 1
        }
        if (true) {
            serial.redirectToUSB()
        }
    }
}
input.onLogoEvent(TouchButtonEvent.LongPressed, function () {
    quest_Note_1.quest_Show_String_For_Note_Small_Func(
    "23-0508-0740"
    )
    if (_debug_Show_Priority_Hi_Bool) {
        _debug_Show_Priority_Hi_Bool = false
        basic.clearScreen()
        led.plot(2, 4)
        basic.pause(2000)
    } else {
        _debug_Show_Priority_Hi_Bool = true
        basic.clearScreen()
        led.plot(2, 0)
        basic.pause(2000)
    }
})
input.onButtonPressed(Button.A, function () {
    quest_Note_3.quest_Show_String_For_Note_Big_Func(
    "Reset Scores"
    )
    quest_Note_2.quest_Show_String_For_Note_Small_Func(
    "Reset all non-BotID fields to Zero"
    )
    scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool = true
    if (true) {
        for (let scoreboard_BotSingle_ArrayOfText_List_1D of scoreboard_BotsAll_ArrayListOfText_2D) {
            scoreboard_BotSingle_ArrayOfText_List_1D[3] = "0"
            scoreboard_BotSingle_ArrayOfText_List_1D[5] = "0"
            scoreboard_BotSingle_ArrayOfText_List_1D[7] = "0"
            scoreboard_BotSingle_ArrayOfText_List_1D[9] = "0"
        }
        quest_Note_2.quest_Show_String_For_Note_Small_Func(
        "Wait for reset to 0 to stabilize/complete"
        )
        basic.clearScreen()
        for (let index = 0; index <= 2; index++) {
            basic.showNumber(3 - index)
            quest_Timer.quest_Set_ContinueCurrentState_CountdownTimer_Func(1, quest_Time_Units_Enum.Seconds)
        }
        basic.clearScreen()
    }
    scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool = false
})
// * General Notes
// 
// * 2019-0519-0340
// 
// ** DFRobot Driver Expansion Board
// 
// * 2019-0525-09-HAA TYJ first complete joystick XY
// 
// * Technical Notes
// 
// * 2019-1019
// 
// ** Create more responsiveness, no DeadZone
// 
// * 2020-0120: 844 SW error : GC allocation failed for requested number bytes: GC (garbage collection) error of 57 variables max,
// 
// ** Delete 'index_y2' (tried to reuse but '844' error)
// 
// ** Tried to reuse 'item' but probably is a system var
// 
// ** Remove unused 'button_AandB_Countdown_CpuCycles', 'buttonA_Then_B_On'
// 
// ** Rename used-only-once-via-set:
// 
// *** 'dashboardDisplay_Brightness_HI' to 'servo_Pan_Degrees' :)+
// 
// *** 'groupChannel_Digit_MIN' to 'servo_Pan_Degrees'
// 
// *** 'groupChannel_Digit_MAX' to 'servo_Tilt_Degrees'
// 
// 
// 
// * 2020-0120-02: Arm Servo
// 
// ** S-bus not work (DFRobot driver), so switch to P-bus (MakeCode driver)
// 
// ** DfRobot only has P0, P1, P2 as Read/Write from MakeCode's Menu, so reserve for Read Only.  Rest for Write Only.
// 
// *** Ultrasonic Sensor: P0 (Read, Echo), P8 (Write, Trigger)
// 
// *** ServoArmRight: P12 (Write-Only)
// 
// *** PIxyCam: P13 (Write-Only) Pan Servo, P14 (Write-Only) Tilt Servo, P1 (Read) Dig In from PixyCam-P1, P2 (Read) Ana In from PIxyCam-P8, S8-Pwr, S8-Gnd
// 
// * 2020-0224-1215
// 
// ** Network Test w/ Gaming Server
// 
// *** w/ Sonar: Simulated or Real
// 
// *** w/ BotId: Random or Real
// 
// * 2020-0305
// 
// ** 844 Error 57,49 variable max issue: Consolidate 'index_X' 'index_Y' to 'index'
// 
// *** Delete obsolete 'joystick_Value'
// 
// * 2020-0328
// 
// ** DFRobot S1 not seem to work for Arm-Right, though worked before, go back to micro:bit P16
// 
// ** abandon usage of S1-S6 for now, not reliable, since not work before, yet TYJ P1-P16 does  :)+
// 
// * 2020-04xx
// 
// Micro-Servo 9G A0090 (Sparkfun)
// 
// ~ HiTec HS-55
// 
// MicroBit: 'servo set pulse pin Px (e.g. P8) to (us) ___'  :)+
// 
// 0 no
// 
// 250 0
// 
// 500 no
// 
// >> 750: 45
// 
// 1000 90 - 10 = 80
// 
// 1250 90 + 10 = 100
// 
// >> 1500 90 + 30
// 
// 1750 180 - 30
// 
// 2000 170
// 
// 2250 190
// 
// >> 2500 225 = 180 + 30/45
// 
// 2750 no
// 
// 3000 no
// 
// * Using DFRobot Servo Pins not reliable, possibly since these are 3.3.v servos (not standard 5.0v servos), thus use MicroBit 'servo write pin Pxx' blocks for reliable 0-180 degrees.
function setup_BotAndController_Fn () {
    if (true) {
        _codeComment_AsText = "System Constants"
        if (true) {
            _system_BotAndController_Mode_As_SETUP_INT = 1
            _system_BotAndController_Mode_As_COMMAND_AS_MAIN_MODE_INT = 2
        }
        if (true) {
            _bool_FALSE_0_ForDigitalPinReadWriteOnly_INT = 0
            _bool_TRUE_1_ForDigitalPinReadWriteOnly_INT = 1
        }
        if (true) {
            _system_InvalidNumber_NEG_999_INT = -999
        }
    }
    if (true) {
        _codeComment_AsText = "System Vars"
        _system_BotAndController_Mode_Int = _system_BotAndController_Mode_As_SETUP_INT
        _system_ScreenFreeze_ForOverrideMessage_Bool = false
    }
    if (true) {
        _codeComment_AsText = "Bot & Controller Setup"
        if (true) {
            screenBrightness_Hi_DEFAULT_INT = 255
            // lowest 1 is still visible :)+
            screenBrightness_MI_INT = 7
            // 127 not low enough, 15 is better, 1 too low, 7 seems good, try 8
            screenBrightness_LO_INT = 1
            screenBrightness_Heartbeat_Count_Int = 0
            // * [30..-5]by0.5 >> 1 sec one-way-trip, [50..-10]by1, [50-..-25]by1, [100..-50]by2, [200..-100]by4, off too long: [250..-50]by4
            if (true) {
                // 255 max too high, stays bright too long; 50 not bad, try 30 for more 1sec heartbeat
                screenBrightness_Heartbeat_Count_MAX_INT = 250
                // 0 not low enough, try -15 for more of 50% duty on/off cycle, try -10 for less off, try -5
                screenBrightness_HeartBeat_Count_MIN_INT = -50
                // * 1 >> 0.5
                screenBrightness_Heartbeat_Count_DELTA_INT = 4
            }
        }
        if (true) {
            // * 500ms seems good, 1000ms no improvement, so stay w/ 500ms
            // * Seems that 3000ms seems best for min. lag issues, but not pragmatic,
            // * so stick with 500ms as recent test shows it as sufficient, vs 400, 300, 200, 100ms.
            _debug_Show_CpuCycleDelay_MILLISEC_INT = 500
        }
    }
    if (true) {
        // // jwc 25-0210-1400 o network_DataPacket_Rcvd_FieldNames_ArrayListOfText = ["#", "L", "M"]
        // // jwc y network_DataPacket_Rcvd_FieldNames_ArrayListOfText = ["A", "L", "R"]
        network_DataPacket_Rcvd_FieldNames_ArrayListOfText = ["A", "L", "R"]
        network_DataPacket_Rcvd_FieldNames_Login_ArrayListOfText = ["Z", "L", "R"]
        if (false) {
            scoreboard_ColumnFrontend_TitleNames_ArrayListOfText = [
            "Bot#",
            "Light+",
            "Light=",
            "Magnet+",
            "Magnet="
            ]
        }
        scoreboard_ColumnFrontend_TitleNames_ArrayListOfText = [
        "Bot#",
        "Servo_Motor: L",
        "Servo_Motor: R",
        "Light Sensor:",
        "AI-Cam Sensor:"
        ]
        scoreboard_ColumnBackend_FieldNames_ArrayListOfText = [
        "B#",
        "L+",
        "L=",
        "M+",
        "M="
        ]
        scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D = [
        scoreboard_ColumnBackend_FieldNames_ArrayListOfText[0],
        "0",
        scoreboard_ColumnBackend_FieldNames_ArrayListOfText[1],
        "0",
        scoreboard_ColumnBackend_FieldNames_ArrayListOfText[2],
        "0",
        scoreboard_ColumnBackend_FieldNames_ArrayListOfText[3],
        "0",
        scoreboard_ColumnBackend_FieldNames_ArrayListOfText[4],
        "0"
        ]
        scoreboard_BotSingle_ArrayOfText_List_1D2 = []
        scoreboard_BotsAll_ArrayListOfText_2D = []
    }
}
function doGroupChannelShow_Func () {
    if (true) {
        doGroupChannel_Show_PerDigit_Func(network_GroupChannel_MyBotAndController_Digit_Hundreds_Int, 0, 0)
        doGroupChannel_Show_PerDigit_Func(network_GroupChannel_MyBotAndController_Digit_Tens_Int, 1, 0)
        doGroupChannel_Show_PerDigit_Func(network_GroupChannel_MyBotAndController_Digit_Ones_Int, 3, 0)
    }
}
input.onButtonPressed(Button.AB, function () {
    quest_Note_3.quest_Show_String_For_Note_Big_Func(
    "Switch Scoreboard Modes"
    )
    if (scoreboard_Server_SerialPrint_RawScores_Bool) {
        scoreboard_Server_SerialPrint_RawScores_Bool = false
        scoreboard_Server_SerialPrint_FormattedScores_Bool = true
    } else {
        scoreboard_Server_SerialPrint_RawScores_Bool = true
        scoreboard_Server_SerialPrint_FormattedScores_Bool = false
    }
    screen_ModeStatus_Fn()
})
// To Insure Both at Synchronized States, Both Bot and Controller Must Start/Re-Start at 'setup_and_startup' State (e.g. for Manual Config Overrides, Debug-Serial-Prints, etc. to work)
// * Important News
// ** 'receivedstring': 18 char max
// ** 'name': 8 char max for this project
radio.onReceivedString(function (receivedString) {
    if (!(scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool)) {
        network_DataPacket_Rcvd_Str = receivedString
        if (_debug_Show_Priority_Hi_Bool) {
            serial.writeString("* A: Raw String: ")
            serial.writeLine("\"" + network_DataPacket_Rcvd_Str + "\"")
        }
        if (true) {
            network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList = network_DataPacket_Rcvd_Str.split(",")
            network_DataPacket_Rcvd_MessageHeader_Key_AsBotId_Str = network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[0].substr(0, network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[0].indexOf(":"))
            quest_Note_1.quest_Show_String_For_Note_Small_Func(
            "Blank last argument (<< NOT SEEM TO WORK) -or- Use current string_length (which is more than enough) to insure read to 'end_of_string'"
            )
            network_DataPacket_Rcvd_MessageHeader_Value_AsBotId_Str = network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[0].substr(network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[0].indexOf(":") + 1, network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[0].length)
        }
        if (true) {
            scoreboard_Bot_Found_Bool = false
            for (let scoreboard_botsingle_arraylistoftext_1d of scoreboard_BotsAll_ArrayListOfText_2D) {
                if (_debug_Show_Priority_Hi_Bool) {
                    serial.writeLine("* B1:" + scoreboard_botsingle_arraylistoftext_1d[0] + "|" + scoreboard_botsingle_arraylistoftext_1d[1] + "|" + network_DataPacket_Rcvd_MessageHeader_Value_AsBotId_Str + "|")
                }
                quest_Note_4.quest_Show_String_For_Note_Small_Func(
                "Hardcode 'Index = 1' to access actual 'BotId'"
                )
                if (scoreboard_botsingle_arraylistoftext_1d[1] == network_DataPacket_Rcvd_MessageHeader_Value_AsBotId_Str) {
                    scoreboard_Bot_Found_Bool = true
                    if (_debug_Show_Priority_Hi_Bool) {
                        serial.writeString("* C1>")
                        for (let scoreboard_botsingle_columndata_1d of scoreboard_botsingle_arraylistoftext_1d) {
                            serial.writeString("" + scoreboard_botsingle_columndata_1d + "|")
                        }
                        serial.writeLine("* C1<")
                    }
                    if (true) {
                        quest_Note_1.quest_Show_String_For_Note_Small_Func(
                        "L,R"
                        )
                        scoreboard_botsingle_arraylistoftext_1d[3] = network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[1].substr(network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[1].indexOf(":") + 1, network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[1].length)
                        scoreboard_botsingle_arraylistoftext_1d[4] = network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[1].substr(network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[1].indexOf(":") + 1, network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[1].length)
                    }
                    if (true) {
                        if (false) {
                            quest_Note_1.quest_Show_String_For_Note_Small_Func(
                            "L+"
                            )
                            scoreboard_botsingle_arraylistoftext_1d[3] = network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[1].substr(network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[1].indexOf(":") + 1, network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[1].length)
                            quest_Note_1.quest_Show_String_For_Note_Small_Func(
                            "L="
                            )
                            scoreboard_botsingle_arraylistoftext_1d[5] = convertToText(parseFloat(scoreboard_botsingle_arraylistoftext_1d[3]) + parseFloat(scoreboard_botsingle_arraylistoftext_1d[5]))
                        }
                        if (false) {
                            quest_Note_1.quest_Show_String_For_Note_Small_Func(
                            "M+"
                            )
                            scoreboard_botsingle_arraylistoftext_1d[7] = network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[2].substr(network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[2].indexOf(":") + 1, network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList[2].length)
                            quest_Note_1.quest_Show_String_For_Note_Small_Func(
                            "M="
                            )
                            scoreboard_botsingle_arraylistoftext_1d[9] = convertToText(parseFloat(scoreboard_botsingle_arraylistoftext_1d[7]) + parseFloat(scoreboard_botsingle_arraylistoftext_1d[9]))
                        }
                    }
                    if (_debug_Show_Priority_Hi_Bool) {
                        serial.writeString("* C2>")
                        for (let scoreboard_botsingle_columndata_1d2 of scoreboard_botsingle_arraylistoftext_1d) {
                            serial.writeString("" + scoreboard_botsingle_columndata_1d2 + "|")
                        }
                        serial.writeLine("* C2<")
                    }
                }
            }
        }
        if (!(scoreboard_Bot_Found_Bool)) {
            if (true) {
                scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D = []
                if (true) {
                    for (let index = 0; index < 10; index++) {
                        scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D.push("")
                    }
                }
                for (let network_datapacket_rcvd_a_keyvaluepair of network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList) {
                    keyvaluepair_key = network_datapacket_rcvd_a_keyvaluepair.substr(0, network_datapacket_rcvd_a_keyvaluepair.indexOf(":"))
                    quest_Note_1.quest_Show_String_For_Note_Small_Func(
                    "Blank last argument (<< NOT SEEM TO WORK) -or- Use current string_length (which is more than enough) to insure read to 'end_of_string'"
                    )
                    keyvaluepair_value = network_datapacket_rcvd_a_keyvaluepair.substr(network_datapacket_rcvd_a_keyvaluepair.indexOf(":") + 1, network_datapacket_rcvd_a_keyvaluepair.length)
                    quest_Note_1.quest_Show_String_For_Note_Big_Func(
                    "23-0518-0805"
                    )
                    if (keyvaluepair_key == network_DataPacket_Rcvd_FieldNames_ArrayListOfText[0]) {
                        scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D[1] = keyvaluepair_value
                    } else if (keyvaluepair_key == network_DataPacket_Rcvd_FieldNames_ArrayListOfText[1]) {
                        quest_Note_1.quest_Show_String_For_Note_Small_Func(
                        "ML"
                        )
                        scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D[3] = keyvaluepair_value
                        if (false) {
                            quest_Note_1.quest_Show_String_For_Note_Small_Func(
                            "L="
                            )
                            scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D[5] = keyvaluepair_value
                        }
                    } else if (keyvaluepair_key == network_DataPacket_Rcvd_FieldNames_ArrayListOfText[2]) {
                        quest_Note_1.quest_Show_String_For_Note_Small_Func(
                        "MR"
                        )
                        scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D[4] = keyvaluepair_value
                        if (false) {
                            quest_Note_1.quest_Show_String_For_Note_Small_Func(
                            "M+"
                            )
                            scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D[7] = keyvaluepair_value
                            quest_Note_1.quest_Show_String_For_Note_Small_Func(
                            "M="
                            )
                            scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D[9] = keyvaluepair_value
                        }
                    } else if (keyvaluepair_key == network_DataPacket_Rcvd_FieldNames_Login_ArrayListOfText[0]) {
                        scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D[1] = keyvaluepair_value
                    } else {
                        if (false) {
                            serial.writeLine("*** ERROR: 2023-0517-1450: 'keyvaluepair_key' Not Recognized ***")
                        } else {
                            quest_Note_4.quest_Show_String_For_Note_Small_Func(
                            "Tolerated Error for Digital-Xay: Fix Later"
                            )
                            serial.writeString("* Key?: ")
                        }
                    }
                }
                if (_debug_Show_Priority_Hi_Bool) {
                    serial.writeString("* D1>")
                    for (let scoreboard_botsingle_columndata_1d3 of scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D) {
                        serial.writeString("" + scoreboard_botsingle_columndata_1d3 + "|")
                    }
                    serial.writeLine("* D1<")
                }
            }
            scoreboard_BotsAll_ArrayListOfText_2D.push(scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D)
            if (_debug_Show_Priority_Hi_Bool) {
                serial.writeString("* D2>")
                for (let scoreboard_botsingle_columndata_1d4 of scoreboard_BotsAll_ArrayListOfText_2D[scoreboard_BotsAll_ArrayListOfText_2D.length - 1]) {
                    serial.writeString("" + scoreboard_botsingle_columndata_1d4 + "|")
                }
                serial.writeLine("* D2<")
            }
            quest_Note_1.quest_Show_String_For_Note_Big_Func(
            "23-0518-0800"
            )
        }
        if (scoreboard_Server_SerialPrint_RawScores_Bool) {
            _codeComment_AsText = "* E: Forward to Server on Raspberry Pi"
            serial.writeLine(network_DataPacket_Rcvd_Str)
        }
    }
})
input.onButtonPressed(Button.B, function () {
    quest_Note_3.quest_Show_String_For_Note_Big_Func(
    "Freeze Scores"
    )
    quest_Note_2.quest_Show_String_For_Note_Small_Func(
    "Refrain from using Button 'A' since overlaps with Startup Press 'A' or 'B'"
    )
    if (scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool) {
        scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool = false
        basic.clearScreen()
        led.plot(2, 4)
        basic.pause(2000)
    } else {
        basic.clearScreen()
        led.plot(2, 0)
        basic.pause(2000)
        scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool = true
    }
})
function screen_ScrollText_Fn (text_Str_In: string) {
    // Fragment the substrings to be interruptible between each 'show string' block
    parsed_Substrings_As_Array = text_Str_In.split(",")
    for (let parsed_Substring_As_Str of parsed_Substrings_As_Array) {
        basic.showString("" + (parsed_Substring_As_Str))
        if (_system_BotAndController_Mode_Int != _system_BotAndController_Mode_As_SETUP_INT) {
            break;
        }
    }
}
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    _codeComment_AsText = "23-0226-1430"
})
function screen_ModeStatus_Fn () {
    if (scoreboard_Server_SerialPrint_RawScores_Bool) {
        if (true) {
            led.plot(0, 2)
            led.unplot(0, 3)
            quest_Timer.quest_Set_ContinueCurrentState_CountdownTimer_Func(2, quest_Time_Units_Enum.Seconds)
        }
    } else if (scoreboard_Server_SerialPrint_FormattedScores_Bool) {
        if (true) {
            led.plot(0, 2)
            led.plot(0, 3)
            quest_Timer.quest_Set_ContinueCurrentState_CountdownTimer_Func(2, quest_Time_Units_Enum.Seconds)
        }
    } else {
        if (true) {
            led.unplot(0, 2)
            led.unplot(0, 3)
            quest_Timer.quest_Set_ContinueCurrentState_CountdownTimer_Func(2, quest_Time_Units_Enum.Seconds)
        }
    }
}
function screen_Clear_Fn (row_X_Max_In: number, col_Y_Max_In: number) {
    for (let index_X = 0; index_X <= row_X_Max_In; index_X++) {
        for (let index_Y = 0; index_Y <= col_Y_Max_In; index_Y++) {
            led.unplot(index_X, index_Y)
        }
    }
}
function doGroupChannel_Show_PerDigit_Func (singleDigit_In: number, OffsetX_In: number, OffsetY_In: number) {
    for (let index222 = 0; index222 <= singleDigit_In - 1; index222++) {
        led.plotBrightness(Math.idiv(index222, 5) + OffsetX_In, index222 % 5 + OffsetY_In, screenBrightness_MI_INT)
    }
}
let parsed_Substrings_As_Array: string[] = []
let keyvaluepair_value = ""
let keyvaluepair_key = ""
let scoreboard_Bot_Found_Bool = false
let network_DataPacket_Rcvd_MessageHeader_Value_AsBotId_Str = ""
let network_DataPacket_Rcvd_MessageHeader_Key_AsBotId_Str = ""
let network_DataPacket_Rcvd_ParsedIntoKeyValuePairs_ArrayList: string[] = []
let network_DataPacket_Rcvd_Str = ""
let scoreboard_BotSingle_ArrayOfText_List_1D2: number[] = []
let scoreboard_BotSingle_KeyValuePairs_ArrayListOfText_1D: string[] = []
let scoreboard_ColumnBackend_FieldNames_ArrayListOfText: string[] = []
let scoreboard_ColumnFrontend_TitleNames_ArrayListOfText: string[] = []
let network_DataPacket_Rcvd_FieldNames_Login_ArrayListOfText: string[] = []
let network_DataPacket_Rcvd_FieldNames_ArrayListOfText: string[] = []
let _debug_Show_CpuCycleDelay_MILLISEC_INT = 0
let screenBrightness_Heartbeat_Count_DELTA_INT = 0
let screenBrightness_HeartBeat_Count_MIN_INT = 0
let screenBrightness_Heartbeat_Count_MAX_INT = 0
let screenBrightness_Heartbeat_Count_Int = 0
let screenBrightness_LO_INT = 0
let screenBrightness_MI_INT = 0
let _system_ScreenFreeze_ForOverrideMessage_Bool = false
let _system_BotAndController_Mode_Int = 0
let _system_InvalidNumber_NEG_999_INT = 0
let _bool_TRUE_1_ForDigitalPinReadWriteOnly_INT = 0
let _bool_FALSE_0_ForDigitalPinReadWriteOnly_INT = 0
let _system_BotAndController_Mode_As_COMMAND_AS_MAIN_MODE_INT = 0
let _system_BotAndController_Mode_As_SETUP_INT = 0
let scoreboard_BotsAll_ArrayListOfText_2D: string[][] = []
let network_HiMessage_Frequency_SEC_INT = 0
let network_GroupChannel_MyBotAndController_Digit_Ones_Int = 0
let network_GroupChannel_MyBotAndController_Digit_Tens_Int = 0
let network_GroupChannel_MyBotAndController_Digit_Hundreds_Int = 0
let network_GroupChannel_MyBotAndController_BASE0_MIN_INT = 0
let network_GroupChannel_MyBotAndController_BASE0_MAX_INT = 0
let screenBrightness_Hi_DEFAULT_INT = 0
let _debug_Show_Priority_Hi_Bool = false
let scoreboard_Server_SerialPrint_RawScores_Bool = false
let scoreboard_Server_SerialPrint_FormattedScores_Bool = false
let scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool = false
let network_GroupChannel_MyBotAndController_Base0_Int = 0
let network_GroupChannel_ScoreboardServer_BASE0_INT = 0
let _codeComment_AsText = ""
// * Ok icon to look upside_down when micro:bit upside_down
if (true) {
    _codeComment_AsText = "'S' = 'S'erver"
    basic.showLeds(`
        . # # # #
        # . . . .
        # # # # #
        . . . . #
        # # # # .
        `)
    // * 3, 2, 1.5sec
    quest_Timer.quest_Set_ContinueCurrentState_CountdownTimer_Func(1.5, quest_Time_Units_Enum.Seconds)
}
if (true) {
    _codeComment_AsText = "ScoreBoard_Server"
    // Constant Channel # for Master Server, which Receives Everyone's Score. Use 255 vs 0, since 0 could be easily not not used by normal users
    network_GroupChannel_ScoreboardServer_BASE0_INT = 255
    // * Good Stress Test: 199 (to test all dots for 10's, 1's; 255 (to test all dots for 100's: 1,2)
    network_GroupChannel_MyBotAndController_Base0_Int = network_GroupChannel_ScoreboardServer_BASE0_INT
}
if (true) {
    setup_BotAndController_Fn()
    setup_Network_Fn()
}
if (true) {
    scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool = false
    scoreboard_Server_SerialPrint_FormattedScores_Bool = false
    scoreboard_Server_SerialPrint_RawScores_Bool = true
    quest_Note_4.quest_Show_String_For_Note_Small_Func(
    "'Debug On' for Testing"
    )
    _debug_Show_Priority_Hi_Bool = false
}
loops.everyInterval(2000, function () {
    quest_Note_3.quest_Show_String_For_Note_Big_Func(
    "Network Heartbeat"
    )
    quest_Note_2.quest_Show_String_For_Note_Small_Func(
    "Little Less Frequent to Not Tie Up Much Resources"
    )
    quest_Note_1.quest_Show_String_For_Note_Small_Func(
    "Heartbeat 'I'm Alive' Status"
    )
    led.toggle(0, 4)
})
loops.everyInterval(2000, function () {
    if (!(scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool) && scoreboard_Server_SerialPrint_FormattedScores_Bool) {
        if (true) {
            serial.writeLine("----- RoboQuest Scoreboard Server -----")
        }
        serial.writeLine("----- RoboQuest X-Ray Dashboard -----")
        for (let value4 of scoreboard_ColumnFrontend_TitleNames_ArrayListOfText) {
            serial.writeString("" + "                    ".substr(0, 20 - value4.length) + value4)
        }
        serial.writeLine("")
        for (let value42 of scoreboard_BotsAll_ArrayListOfText_2D) {
            for (let value023 of value42) {
                serial.writeString("" + "                    ".substr(0, 10 - value023.length) + value023)
            }
            serial.writeLine("")
        }
        serial.writeLine("")
    } else if (scoreboard_BotsAll_ArrayList_2D_StopFreeze_Bool) {
        serial.writeLine("*** Freeze Scores ***")
    }
})
basic.forever(function () {
    quest_Note_1.quest_Show_String_For_Note_Big_Func(
    "23-0518-0710"
    )
})
basic.forever(function () {
    _codeComment_AsText = "23-0226-1430"
})
basic.forever(function () {
    screenBrightness_Heartbeat_Count_Int += screenBrightness_Heartbeat_Count_DELTA_INT
    // * Use '<= and >=' vs '< and >' since do not want to go past boundaries when changing values
    if (screenBrightness_Heartbeat_Count_Int <= screenBrightness_HeartBeat_Count_MIN_INT || screenBrightness_Heartbeat_Count_Int >= screenBrightness_Heartbeat_Count_MAX_INT) {
        screenBrightness_Heartbeat_Count_DELTA_INT = -1 * screenBrightness_Heartbeat_Count_DELTA_INT
    }
})
basic.forever(function () {
    quest_Note_1.quest_Show_String_For_Note_Big_Func(
    "23-0518-0720"
    )
    if (_system_BotAndController_Mode_Int == _system_BotAndController_Mode_As_SETUP_INT) {
        basic.showLeds(`
            . # # # #
            # . . . .
            # # # # #
            . . . . #
            # # # # .
            `)
        quest_Timer.quest_Set_ContinueCurrentState_CountdownTimer_Func(2, quest_Time_Units_Enum.Seconds)
        screen_Show_DiagnosticDashboard_Func()
        _system_BotAndController_Mode_Int = _system_BotAndController_Mode_As_COMMAND_AS_MAIN_MODE_INT
    }
})
loops.everyInterval(5000, function () {
    quest_Note_3.quest_Show_String_For_Note_Big_Func(
    "Show Mode Status"
    )
    quest_Note_2.quest_Show_String_For_Note_Small_Func(
    "Less Frequent to Not Tie Up Much Resources"
    )
    screen_ModeStatus_Fn()
})
