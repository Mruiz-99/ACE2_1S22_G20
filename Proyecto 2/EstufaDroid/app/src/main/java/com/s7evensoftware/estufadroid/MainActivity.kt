package com.s7evensoftware.estufadroid

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.Request
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.s7evensoftware.estufadroid.databinding.ActivityMainBinding
import org.json.JSONObject


class MainActivity : AppCompatActivity(), View.OnClickListener {

    private lateinit var binding: ActivityMainBinding
    private val apiRequestQueue by lazy { Volley.newRequestQueue(this) }
    private lateinit var apiURL:String
    private var sparkStat = false
    private var valveStat = false


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        //binding = ActivityMainBinding.inflate(layoutInflater)
        binding = ActivityMainBinding.inflate(layoutInflater)
        prepareViews()
        setContentView(binding.root)
    }

    private fun prepareViews() {
        RestoreSettings()
        sendAPIGET_Request("getStatus/")

        binding.mainIpInput.setText(apiURL)

        binding.mainSettingsShow.setOnClickListener(this)
        binding.mainSaveIp.setOnClickListener(this)

        binding.mainSwitchSpark.setOnClickListener(this)
        binding.mainSwitchValve.setOnClickListener(this)
    }

    private fun sendAPIPOST_request(api_path: String, value:Boolean){

        val jsonBody = JSONObject()
        jsonBody.put("value", value)
        val requestBody = jsonBody.toString()

        val stringRequest: StringRequest = object : StringRequest(
            Method.POST,
            "$apiURL/$api_path",
            {
                Log.e("Main",it)
                val result = JSONObject(it)
                val response = result.getString("result")

                if(response == "Ok" && api_path == "setSpark/"){
                    if(value){
                        binding.mainBurnerGraphic.setImageDrawable(getDrawable(R.drawable.buerner_on))
                    }else{
                        binding.mainBurnerGraphic.setImageDrawable(getDrawable(R.drawable.buerner_off))
                    }
                }
            },
            {
                Toast.makeText(this, "Error enviando request a la API", Toast.LENGTH_SHORT).show()
            }) {
            override fun getBodyContentType(): String {
                return "application/json"
            }

            override fun getBody(): ByteArray {
                return requestBody.toByteArray()
            }
        }

        apiRequestQueue.add(stringRequest)
    }

    private fun sendAPIGET_Request(api_path:String){
        val request = JsonArrayRequest(
            Request.Method.GET,
            "$apiURL/$api_path",
            null,
            { responseObject ->
                val response = responseObject.get(0) as JSONObject

                sparkStat = response.getBoolean("spark")
                valveStat = response.getBoolean("valve")

                binding.mainSwitchValve.isEnabled = true
                binding.mainSwitchValve.isChecked = valveStat

                binding.mainSwitchSpark.isEnabled = true
                binding.mainSwitchSpark.isChecked = sparkStat
                if(sparkStat){
                    binding.mainBurnerGraphic.setImageDrawable(getDrawable(R.drawable.buerner_on))
                }
                Toast.makeText(this,"Conexion con API - OK", Toast.LENGTH_LONG).show()
            },
            { error ->
                binding.mainSwitchValve.isEnabled = false
                binding.mainSwitchSpark.isEnabled = false
                Toast.makeText(this,"Conexion con API - ERR  $error", Toast.LENGTH_LONG).show()
                Log.e("Main","Error: ${error.message}")
            }
        )
        apiRequestQueue.add(request)
    }

    private fun onSaveSettings() {
        val sharedPref = getPreferences(Context.MODE_PRIVATE) ?: return
        with (sharedPref.edit()){
            putString("API_HOST", apiURL)
            apply()
        }
        Toast.makeText(this, R.string.settings_saved_prompt, Toast.LENGTH_SHORT).show()
    }

    private fun RestoreSettings(){
        val sharedPref = getPreferences(Context.MODE_PRIVATE)
        apiURL = sharedPref.getString("API_HOST", "http://192.168.1.21:7000")!!
    }

    override fun onClick(p0: View) {
        when(p0.id){
            R.id.main_save_ip -> {
                apiURL = "${binding.mainIpInput.text}"
                binding.mainSettings.visibility = View.GONE
                onSaveSettings()
                sendAPIGET_Request("getStatus/")
            }
            R.id.main_settings_show -> {
                binding.mainSettings.visibility = View.VISIBLE
            }

            R.id.main_switch_spark -> {
                Log.e("Main","Switch: ${binding.mainSwitchSpark.isChecked}")
                sendAPIPOST_request("setSpark/", binding.mainSwitchSpark.isChecked)
            }

            R.id.main_switch_valve -> {
                Log.e("Main","Switch: ${binding.mainSwitchValve.isChecked}")
                sendAPIPOST_request("setValve/", binding.mainSwitchValve.isChecked)
            }
        }
    }
}