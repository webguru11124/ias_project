import h5py
import json
import datetime

# with h5py.File('test004.hdf5', 'w') as f:
#     print('call me 1')
#     o_group = f.create_group('Original_Group')
#     m_group = f.create_group('Measured_Group')
#     print('call me 2 ')
    
#     # second-class groups
#     o_image_data_group = o_group.create_group('Image_Data_Group')
#     o_account_setting_group = o_group.create_group('Account_Setting_Group')
#     o_spatial_yzx_pos_info_group = o_group.create_group('Spatial_YZX_Pos_Info_Group')
#     o_manufacturer_info_group = o_group.create_group('Manufacturer_Info_Group')
#     o_spatial_color_correction_info_group = o_group.create_group('Spatial_Color_Correction_Info_Group')
#     print('call me 3')
    
#     m_image_data_group = m_group.create_group('Image_Data_Group')
#     m_account_setting_group = m_group.create_group('Account_Setting_Group')
#     m_spatial_yzx_pos_info_group = m_group.create_group('Spatial_YZX_Pos_Info_Group')
#     m_manufacturer_info_group = m_group.create_group('Manufacturer_Info_Group')
#     m_spatial_color_correction_info_group = m_group.create_group('Spatial_Color_Correction_Info_Group')
#     m_image_view_setting_group = m_group.create_group('Image_View_Setting_Group')
#     # for key in keyList:
#     #     value = data.get(key)
#     #     m_image_view_setting_group.attrs[key] = json.loads(value)
#     # Add Measured_Account attributes
#     m_account_setting_group.attrs['Measured_Account_Name'] = 'dimco_pajkic'
#     m_account_setting_group.attrs['Measured_Experiment_Name'] = 'first_experiment'
#     m_account_setting_group.attrs['Data_Measurement_Start_Date_Time'] = '2023-05-04 00:00:00'
#     m_account_setting_group.attrs['Data_Measurement_End_Date_Time'] = '2023-05-04 01:00:00'
#     m_account_setting_group.attrs['Data_Measurement_Time'] = 3600
#     m_account_setting_group.attrs['Number_of_Series_Measured'] = 1
# # f.close()

# def update_h5py_file(data, keyList):
def update_h5py_file(data, keyList):
    now = datetime.datetime.now()
    # Convert to string
    date_time_str = now.strftime('%Y-%m-%d %H:%M:%S')

    print('update h5py file')
    # print(data)
    with h5py.File('measure_result.hdf5', 'w') as f:
        o_group = f.create_group('Original_Group')
        m_group = f.create_group('Measured_Group')
        # second-class groups
        o_image_data_group = o_group.create_group('Image_Data_Group')
        o_account_setting_group = o_group.create_group('Account_Setting_Group')
        o_spatial_yzx_pos_info_group = o_group.create_group('Spatial_YZX_Pos_Info_Group')
        o_manufacturer_info_group = o_group.create_group('Manufacturer_Info_Group')
        o_spatial_color_correction_info_group = o_group.create_group('Spatial_Color_Correction_Info_Group')
        m_image_data_group = m_group.create_group('Image_Data_Group')
        m_account_setting_group = m_group.create_group('Account_Setting_Group')
        m_spatial_yzx_pos_info_group = m_group.create_group('Spatial_YZX_Pos_Info_Group')
        m_manufacturer_info_group = m_group.create_group('Manufacturer_Info_Group')
        m_spatial_color_correction_info_group = m_group.create_group('Spatial_Color_Correction_Info_Group')
        m_image_view_setting_group = m_group.create_group('Image_View_Setting_Group')
        for key in keyList:
            value = data.get(key)
            print('key: value===>', key, value)
            m_image_view_setting_group.attrs[key] = value
        # Add Measured_Account attributes
        m_account_setting_group.attrs['Measured_Account_Name'] = 'dimco_pajkic'
        m_account_setting_group.attrs['Measured_Experiment_Name'] = 'first_experiment'
        m_account_setting_group.attrs['Data_Measurement_Start_Date_Time'] = date_time_str
        m_account_setting_group.attrs['Data_Measurement_End_Date_Time'] = date_time_str
        m_account_setting_group.attrs['Data_Measurement_Time'] = 3600
        m_account_setting_group.attrs['Number_of_Series_Measured'] = 1
    f.close()
    return {"status": "success", "msg": "successfully updated", "file_path": "measure_result.hdf5"}
