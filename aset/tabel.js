    
$.fn.makeTabel = function(attrs){
        
    isiForm = function(attrs){
           
    }
        $this = $(this);
        url = attrs.url;
        fields = attrs.fields,
        tabel = $("<table/>");
        
        $.ajax({
            url: url,
            dataType: "json",
            method: "get"
        }).success(function( json ){
            $.each(json.results, function( key, value ){
                
                baris = $("<tr/>");
                
                $.each(fields, function(key_f, value_f){
                    col = $("<td/>");
                    switch(value_f.type){
                        case 'date':
                            col.append(moment(value[value_f.key]).fromNow());
                            break;
                        default:
                            col.append(value[value_f.key]);
                            break;
                    }
                    baris.append(col);
                });
                id_edit_btn = "id_edit_btn_" + value['id'];
                baris.append("<td><button id='" + id_edit_btn + "' class='edit_btn btn btn-info'>edit</button></td>");
                sc_action = "jQuery('[name=" + 'id' + "]').val('" + value['id'] + "'); console.log(jQuery('[name=" + 'id' + "]').val());";
                sc = "jQuery(function(){jQuery('#" + id_edit_btn + "').click(function(){" + sc_action + "});})";
                baris.append("<script>" + sc + "</script>");
                tabel.append(baris);
                $this.html(tabel);
            });
        });
    }